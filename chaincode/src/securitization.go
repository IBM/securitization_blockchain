/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

package main

import (
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

// ============================================================================================================================
// Asset Definitions - The ledger will store marbles and owners
// ============================================================================================================================

// type Underwriting struct {
// 	Credit, DebtToIncome string
// }


// type Configuration struct {
//     Val   string
//     Proxy struct {
//         Address string
//         Port    string
//     }
// }

type Pool struct {
	ObjectType     string      `json:"docType"`     //field for couchdb
	Id             string      `json:"id"`
	Rating         string      `json:"rating"`
	ExcessSpread   float64     `json:excessspread` // remainder of payments that aren't sent to investors/originator
	Value          float64     `json:value`				// sum of all mortgage values
	Assets         []string    `json:"assets"`    // string of asset ids
	// Assets         []*Asset     `json:"assets"`    // string of asset ids
	// Investors      []Investor  `json:"investors"` // TODO, array of investor ids,
	// Securities		 []*Security  `json:"securities"`
	Securities		 []string 	 `json:"securities"`
	// Securities		 map[string]Security  `json:"securities"`
	// Return				    float64    `json:"return"` // maybe this should be the
	// Assets         map       `json:"assets"`
	// AssetRelation  []string  `json:"assets"`
}

type Asset struct {
	ObjectType     string                      `json:"docType"` //field for couchdb
	Id       			 string                      `json:"id"`      //the fieldtags are needed to keep case from bouncing around
	Originator     Originator	         				 `json:"originator"`
	Pool           string	                     `json:"pool"` // TODO, not sure if this is needed
	State          string                      `json:"state"` // active, deliquent
	Underwriting   string   					  			 `json:"underwriting"` // fico, user // TODO, this should be an object, but having issues with json marshalling
	Rating         string                      `json:"rating"` // generated as result of FICO score and other underwriting info, used to determine risk. higher risk generally results in higher return, but likeliehood of default
	InterestRate   string           	 				 `json:"interest"`
	Balance        string                		   `json:"balance"`
	MonthyPayment  string											 `json:"monthlypayment"`
	RemainingPayments   string								 `json:"remainingpayments"`
	ExpectedPayoffAmount string							   `json:"payoffamount"`

	// (( InterestRate / 12 ) * Balance * PaymentsLeft) / (1 - (1 + (InterestRate / 12) ) ^ -PaymentsLeft )
	// (((asset.InterestRate / 12) * asset.balance * asset.PaymentsLeft) / math.Pow( (1 - (1 + (asset.InterestRate / 12)) ), (-1 * asset.PaymentsLeft) ))

	// Investor       InvestorRelation	   `json:"investor"`
	// Underwriting struct {
	// 	FICO					 string   `json:"FICO"`
	// 	// DebtToIncome   float64  `json:"debt_to_income"`
	// 	// MonthsActive   int  `json:"months_active"`
	// } `json:"underwriting"`
	// Pool           *Pool	                     `json:"pool"` // TODO, not sure if this is needed
}

// Underwriting information is used to determine asset rating, which subsequently determines which security it's associated with
// type Underwriting struct {
// 	FICO					 string   `json:"FICO"`
// 	// DebtToIncome   float64  `json:"debt_to_income"`
// }

// ----- Participants ----- //
type Originator struct {
	ObjectType     string   `json:"docType"`     //field for couchdb
	Id             string   `json:"id"`
	Username       string   `json:"username"`
	Company        string   `json:"company"`
	ProcessingFee  string   `json:"processingfee"` // percentage
	Assets         []string `json:"assets"` // list of asset ids will do
	Balance        string  `json:"balance"` // originator receives proceeds from security sales
	// Assets         []Asset `json:"assets"`
	// AssetRelation  []string `json:"assets"`
}

type Security struct {
	// ObjectType     string    `json:"docType"`     //field for couchdb
	Id                  string      `json:"id"`
	// Amount				    int			   `json:"amount"`
	Rating				      string		  `json:"rating"`
	CouponRate				  float64     `json:"couponrate"` // lets say return is 8% on the year, and each security costs 1k
																					  // so monthly_payout per security should total (1k * .08) / 12
																					  // dividing that by number of assets in our pool will determine how much investor gets from each payment
	Value               string    `json:"value"` // Expected payout
	MonthsUntilMaturity int 	     `json:"monthsuntilmaturity"` // number of payments investor will receive
	Maturity					  bool       `json:"maturity"`
	MaturityDate        string     `json:"maturitydate"`
	Investor            string     `json:"investor"` // TODO, array of investor ids, or array of structs?
	Pool				        string			 `json:"pool"`
	// Expiration     string     `json`
	AmountPaid          string  `json:"amountpaid"`
	PercentageSecuritized float64 `json:percentagesecuritized`
	// AmountDue      float64  `json:"investor"`
	// 																						 // TODO, investor ids should
}
// type Borrower struct {
// 	ObjectType string `json:"docType"`     //field for couchdb
// 	Id         string `json:"id"`
// 	Username   string `json:"username"`
// 	// Creditworthiness     string `json`
// }

type Investor struct {
	ObjectType     string     `json:"docType"`     //field for couchdb
	Id             string     `json:"id"`
	Username       string     `json:"username"`
	Balance				 float64    `json:"balance"`
	Securities		 []string    `json:"securities"`
	// Securities		 []Security `json:"securities"`
	// Company        string     `json:"company"`
	// AssetRelation  []string   `json:"assets"`
}

type Tranche struct {
	// ObjectType     string    `json:"docType"`     //field for couchdb
	Id             string    `json:"id"`
	Amount				 int			  `json:"amount"`
	Rating				 string		  `json:"rating"`
	Return				 float64    `json:"return"` // lets say return is 8% on the year, and each security costs 1k
																					  // so monthly_payout per security should total (1k * .08) / 12
																					  // dividing that by number of assets in our pool will determine how much investor gets from each payment
	// Pool				   Pool			 `json:"amount"`
	// Expiration     string     `json`
	// Investors      []Investor `json:"investors"` // TODO, array of investor ids, or array of structs?
	// 																						 // TODO, investor ids should
}

// type BorrowerRelation struct {
// 	Id         string `json:"id"`
// 	Username   string `json:"username"`    //this is mostly cosmetic/handy, the real relation is by Id not Username
// 	Company    string `json:"company"`     //this is mostly cosmetic/handy, the real relation is by Id not Company
// }

type AssetRelation struct {
	Id         string `json:"id"`
	Username   string `json:"username"`    //this is mostly cosmetic/handy, the real relation is by Id not Username
	Company    string `json:"company"`     //this is mostly cosmetic/handy, the real relation is by Id not Company
}

type OriginatorRelation struct {
	Id         string `json:"id"`
	Username   string `json:"username"`    //this is mostly cosmetic/handy, the real relation is by Id not Username
	Company    string `json:"company"`     //this is mostly cosmetic/handy, the real relation is by Id not Company
}

type InvestorRelation struct {
	Id         string `json:"id"`
	Username   string `json:"username"`    //this is mostly cosmetic/handy, the real relation is by Id not Username
	Company    string `json:"company"`     //this is mostly cosmetic/handy, the real relation is by Id not Company
}

type PoolRelation struct {
	Id         string `json:"id"`
	Username   string `json:"username"`    //this is mostly cosmetic/handy, the real relation is by Id not Username
	Company    string `json:"company"`     //this is mostly cosmetic/handy, the real relation is by Id not Company
}


// ============================================================================================================================
// Main
// ============================================================================================================================
func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode - %s", err)
	}
}


// ============================================================================================================================
// Init - initialize the chaincode
//
// Marbles does not require initialization, so let's run a simple test instead.
//
// Shows off PutState() and how to pass an input argument to chaincode.
// Shows off GetFunctionAndParameters() and GetStringArgs()
// Shows off GetTxID() to get the transaction ID of the proposal
//
// Inputs - Array of strings
//  ["314"]
//
// Returns - shim.Success or error
// ============================================================================================================================
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	fmt.Println("Securitization Process Is Starting Up")
	funcName, args := stub.GetFunctionAndParameters()
	var number int
	var err error
	txId := stub.GetTxID()

	fmt.Println("Init() is running")
	fmt.Println("Transaction ID:", txId)
	fmt.Println("  GetFunctionAndParameters() function:", funcName)
	fmt.Println("  GetFunctionAndParameters() args count:", len(args))
	fmt.Println("  GetFunctionAndParameters() args found:", args)

	// expecting 1 arg for instantiate or upgrade
	if len(args) == 1 {
		fmt.Println("  GetFunctionAndParameters() arg[0] length", len(args[0]))

		// expecting arg[0] to be length 0 for upgrade
		if len(args[0]) == 0 {
			fmt.Println("  Uh oh, args[0] is empty...")
		} else {
			fmt.Println("  Great news everyone, args[0] is not empty")

			// convert numeric string to integer
			number, err = strconv.Atoi(args[0])
			if err != nil {
				return shim.Error("Expecting a numeric string argument to Init() for instantiate")
			}

			// this is a very simple test. let's write to the ledger and error out on any errors
			// it's handy to read this right away to verify network is healthy if it wrote the correct value
			err = stub.PutState("selftest", []byte(strconv.Itoa(number)))
			if err != nil {
				return shim.Error(err.Error())                  //self-test fail
			}
		}
	}

	// showing the alternative argument shim function
	alt := stub.GetStringArgs()
	fmt.Println("  GetStringArgs() args count:", len(alt))
	fmt.Println("  GetStringArgs() args found:", alt)

	// store compatible marbles application version
	err = stub.PutState("securitization_ui", []byte("1.0.0"))
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("Ready for action")                          //self-test pass
	return shim.Success(nil)
}


// ============================================================================================================================
// Invoke - Our entry point for Invocations
// ============================================================================================================================
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println(" ")
	fmt.Println("starting invoke, for - " + function)

	// Handle different functions
	if function == "init" {                    //initialize the chaincode state, used as reset
		return t.Init(stub)
	} else if function == "read" {             //generic read ledger
		return read(stub, args)
	} else if function == "write" {            //generic writes to ledger
		return write(stub, args)
	// } else if function == "delete_marble" {    //deletes a marble from state
	// 	return delete_marble(stub, args)
	} else if function == "init_asset" {      //create a new marble
		return init_asset(stub, args)
	} else if function == "init_asset_pool"{        //create a new marble owner
		return init_asset_pool(stub, args)
	} else if function == "pool_asset"{        //create a new marble owner
		return pool_asset(stub, args)
	} else if function == "process_payment" {      //create a new marble
		return process_payment(stub, args)
	} else if function == "set_originator" {        //change owner of a marble
		return set_originator(stub, args)
	} else if function == "init_originator"{        //create a new marble owner
		return init_originator(stub, args)
	} else if function == "init_investor"{        //create a new marble owner
		return init_investor(stub, args)
	} else if function == "init_security" {      //create a new marble
		return init_security(stub, args)
	} else if function == "buy_security" {      //create a new marble
		return buy_security(stub, args)
	} else if function == "value_pool" {      //create a new marble
		return value_pool(stub, args)
	} else if function == "value_asset" {      //create a new marble
		return value_asset(stub, args)
	} else if function == "delete" {      //create a new marble
		return delete(stub, args)

  // buy / sell securities will have a
	// } else if function == "buy_securities"{        //create a new marble owner
	// 	return buy_securities(stub, args)
	// } else if function == "sell_securities"{        //create a new marble owner
	// 	return sell_securities(stub, args)


	} else if function == "read_everything"{   //read everything, (owners + marbles + companies)
		return read_everything(stub)
	// } else if function == "getHistory"{        //read history of a marble (audit)
	// 	return getHistory(stub, args)
	// } else if function == "getMarblesByRange"{ //read a bunch of marbles by start and stop id
	// 	return getMarblesByRange(stub, args)
	// } else if function == "disable_owner"{     //disable a marble owner from appearing on the UI
	// 	return disable_owner(stub, args)
	}

	// error out
	fmt.Println("Received unknown invoke function name - " + function)
	return shim.Error("Received unknown invoke function name - '" + function + "'")
}


// ============================================================================================================================
// Query - legacy function
// ============================================================================================================================
func (t *SimpleChaincode) Query(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Error("Unknown supported call - Query()")
}
