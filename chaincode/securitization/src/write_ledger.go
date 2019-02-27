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
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"reflect"
	"math"
	"time"
	// "encoding/gob"
	// "bytes"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// ============================================================================================================================
// write() - genric write variable into ledger
//
// Shows Off PutState() - writting a key/value into the ledger
//
// Inputs - Array of strings
//    0   ,    1
//   key  ,  value
//  "abc" , "test"
// ============================================================================================================================
func write(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var key, value string
	var err error
	fmt.Println("starting write")

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2. key of the variable and value to set")
	}

	// input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	key = args[0]                                   //rename for funsies
	value = args[1]
	err = stub.PutState(key, []byte(value))         //write the variable into the ledger
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end write")
	return shim.Success(nil)
}

// ============================================================================================================================
// delete_marble() - remove a marble from state and from marble index
//
// Shows Off DelState() - "removing"" a key/value from the ledger
//
// Inputs - Array of strings
//      0      ,         1
//     id      ,  authed_by_company
// "m999999999", "united marbles"
// ============================================================================================================================
func delete(stub shim.ChaincodeStubInterface, args []string) (pb.Response) {
	fmt.Println("starting delete")

	id := args[0]

	err := stub.DelState(id)                                                 //remove the key from chaincode state
	if err != nil {
		return shim.Error("Failed to delete state")
	}

	fmt.Println("- end delete")
	return shim.Success(nil)
}

// ============================================================================================================================
// Init Asset - create a new asset, store into chaincode state
//
// Shows off building a key's JSON value manually
//
// Inputs - Array of strings

//      0      ,    1  ,     				2  ,      																			3          			 ,    4     ,     5					, 	6
//     id      ,  loan amount ,  borrower_info , 															, state								 , interest ,  balance due	, grade
// "m999999999", "545,000"    ,   object																				deliquent/in payment , 	3.0    , 		520,000			,  BBB
															// credit/income verification/debt to income,

// ============================================================================================================================
func init_asset(stub shim.ChaincodeStubInterface, args []string) (pb.Response) {
	var err error
	fmt.Println("starting init_asset")
	// if len(args) != 5 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 5")
	// }
	//input sanitation
	// err = sanitize_arguments(args)
	// if err != nil {
	// 	return shim.Error(err.Error())
	// }
	// asset_id := args[0]
	// // initial_amount := args[1] //strings.ToLower(args[1])
	// balance := args[1]
	// // state := args[2]
	// interest := args[2]
	// // underwriting, err := json.Marshal(args[5])  //make(map(args[5]))
	// // monthlyPayment := args[3]
  // remainingpayments := args[3]
	// underwriting := args[4]  //make(map(args[5]))
	// state := "active"

	var asset Asset
	asset.Id = args[0]
	asset.Balance =  args[1]
	asset.InterestRate = args[2]
	asset.RemainingPayments = args[3]
	fmt.Println(asset)
	// asset.Underwriting = args[4]
	asset.State = "active"
	// asset.ObjectType = "fin_asset"
	// originator.Username = strings.ToLower(args[1])
	// originator.Enabled = true
	//check if user already exists
	// TODO, uncomment
	// _, err = get_originator(stub, originator.Id)
	// if err == nil {
	// 	fmt.Println("This originator already exists - " + originator.Id)
	// 	return shim.Error("This originator already exists - " + originator.Id)
	// }
	//store user
	balance, _ := strconv.ParseFloat(asset.Balance, 32)
	// fmt.Println("balance set")
	interest, _ := strconv.ParseFloat(asset.InterestRate, 32)
	// fmt.Println("interest set")
	remainingPayments, _ := strconv.ParseFloat(asset.RemainingPayments, 32)
	// fmt.Println("remaining set")
	trueValue := (((interest / 12.0) * balance * remainingPayments) / (1.0 - math.Pow( ( (1.0 + ( interest / 12.0)) ), (-1.0 * remainingPayments) )))
	// fmt.Println("trueValue")
	// fmt.Println(trueValue)
	// if math.IsNaN(trueValue) {
	// 	fmt.Println("missing parameters")
	// 	return shim.Error("missing parameters")
	// }
	asset.ExpectedPayoffAmount = strconv.FormatFloat(trueValue, 'f', 2, 64)

	assetAsBytes, _ := json.Marshal(asset)                         //convert to array of bytes
	fmt.Println("writing asset to state")
	fmt.Println(string(assetAsBytes))
	err = stub.PutState(asset.Id, assetAsBytes)                    //store owner by its Id
	if err != nil {
		fmt.Println("Could not store asset")
		return shim.Error(err.Error())
	}

	// build the marble json string manually
	// monthlyPayment := calculate_monthly_payment(balance, interest,  remainingpayments)
	// str := `{
	// 	"docType":"asset",
	// 	"id": "` + asset_id + `",
	// 	"state": "` + state + `",
	// 	"interest": "` + interest + `",
	// 	"balance": "` + balance + `",
	// 	"remainingpayments": "` + remainingpayments + `",
	// 	"underwriting":"` + underwriting + `"
	// }`
	// fmt.Println("asset str")
	// fmt.Println(str)

	// err = stub.PutState(asset_id, []byte(str))                         //store marble with id as key
	// if err != nil {
		// return shim.Error(err.Error())
	// }
	fmt.Println("- end init_asset")

	// calculate payoff amount
	// value_asset(stub, []string{asset_id})
	return shim.Success(nil)
}

// init_asset_pool
// str := `{
// 	"docType":"pool",
// 	"id": "` + id + `",
// 	"rating": "` + rating + `",
// 	"assets": "` + [] + `",
// }`



// update_asset


// generate_securities







// pool_asset (asset)
// underwriting info gives grade
// grade determines pool
// pool determines return, but also likliehood of failure/delinquency


// ============================================================================================================================
// Init Owner - create a new owner aka end user, store into chaincode state
//
// Shows off building key's value from GoLang Structure
//
// Inputs - Array of Strings
//           0     ,     1   ,   2
//      owner id   , username, company
// "o9999999999999",     bob", "united marbles"
// ============================================================================================================================
func init_originator(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting init_originator")

	// if len(args) != 3 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 3")
	// }

	//input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	var originator Originator
	// originator.ObjectType = "asset_originator"
	originator.Id =  args[0]
	// originator.Username = strings.ToLower(args[1])
	originator.Company = args[1]
	originator.ProcessingFee = args[2]

	// originator.Enabled = true
	fmt.Println(originator)

	//check if user already exists

	// TODO, uncomment
	// _, err = get_originator(stub, originator.Id)
	// if err == nil {
	// 	fmt.Println("This originator already exists - " + originator.Id)
	// 	return shim.Error("This originator already exists - " + originator.Id)
	// }

	//store user
	originatorAsBytes, _ := json.Marshal(originator)                         //convert to array of bytes
	err = stub.PutState(originator.Id, originatorAsBytes)                    //store owner by its Id
	if err != nil {
		fmt.Println("Could not store originator")
		return shim.Error(err.Error())
	}

	fmt.Println("- end init_originator")
	return shim.Success(nil)
}

// each asset should have an originator. originator and investor will receive set portion of mortgage payments
// originator has to be created here before bringing in an asset
func set_originator(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting set_originator")

	// this is quirky
	// todo - get the "company that authed the transfer" from the certificate instead of an argument
	// should be possible since we can now add attributes to the enrollment cert
	// as is.. this is a bit broken (security wise), but it's much much easier to demo! holding off for demos sake

	// if len(args) != 3 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 3")
	// }

	// input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

  // asset id
	// processing fee

	var asset_id = args[0]
	var originator_id = args[1]
	assetAsBytes, err := stub.GetState(asset_id)

	if err != nil {
		return shim.Error("Failed to get asset")
	}
	asset := Asset{}
	err = json.Unmarshal(assetAsBytes, &asset)           //un stringify it aka JSON.parse()
	if err != nil {
		// fmt.Printf("%+v\n", security)
		fmt.Println(string(assetAsBytes))
		return shim.Error(err.Error())
	}
	originatorAsBytes, err := stub.GetState(originator_id)
	if err != nil {
		return shim.Error("Failed to get originator")
	}
	originator := Originator{}
	json.Unmarshal(originatorAsBytes, &originator)           //un stringify it aka JSON.parse()

	fmt.Println("asset.Id")
	fmt.Println(asset.Id)
	fmt.Println("originator.Assets")
	fmt.Println(originator.Assets)
	fmt.Println("checking for asset")
	assetInArray, _ := InArray(asset.Id , originator.Assets)
	fmt.Println("assetInArray")
	fmt.Println(assetInArray)


	if !assetInArray {
		fmt.Println("adding asset to originator array")
		// return shim.Error("security already purchased")
		originator.Assets = append( originator.Assets, asset.Id )
		originatorAsBytes, _ := json.Marshal(originator)           //convert to array of bytes
		fmt.Println(string(originatorAsBytes))
		fmt.Println("originator_id")
		fmt.Println(originator_id)

		err = stub.PutState(originator_id, originatorAsBytes)     //rewrite the marble with id as key
		if err != nil {
			return shim.Error(err.Error())
		}
	}
	// check authorizing company
	// if res.Owner.Company != authed_by_company{
	// 	return shim.Error("The company '" + authed_by_company + "' cannot authorize transfers for '" + res.Owner.Company + "'.")
	// }

	// transfer the asset
	asset.Originator = originator_id                   //change the owner
	asset_balance, _ := strconv.ParseFloat(asset.Balance, 32)
	originator_processing_fee, _ := strconv.ParseFloat(originator.ProcessingFee, 32)
	asset_remaining_payments, _ := strconv.ParseFloat(asset.RemainingPayments, 32)
	asset.ProcessingPayment = strconv.FormatFloat(((asset_balance * originator_processing_fee) / asset_remaining_payments ),  'f', 6, 64)
	// res.Owner.Username = owner.Username
	// res.Owner.Company = owner.Company
	assetAsBytes, _ = json.Marshal(asset)           //convert to array of bytes
	fmt.Println(string(assetAsBytes))

	err = stub.PutState(asset_id, assetAsBytes)     //rewrite the marble with id as key
	if err != nil {
		return shim.Error(err.Error())
	}
	fmt.Println("- end set_originator")
	return shim.Success(nil)
}

func init_asset_pool(stub shim.ChaincodeStubInterface, args []string) (pb.Response) {
	var err error
	fmt.Println("starting init_asset_pool")

	// if len(args) != 5 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 5")
	// }

	//input sanitation
	// err = sanitize_arguments(args)
	// if err != nil {
	// 	return shim.Error(err.Error())
	// }

	// id := args[0]
	// rating := args[1] //strings.ToLower(args[1])
	var pool Pool
	pool.Id = args[0]

	// Grades
	// AAA, AA, A, BAA, BA, B, CAA, CA, C
	// pool, err := get_asset_pool(stub, id)
	// if err == nil {
	// 	fmt.Println("This asset pool already exists - " + id)
	// 	fmt.Println(asset)
	// 	return shim.Error("This asset pool already exists - " + id)  //all stop a marble by this id exists
	// }

	//build the marble json string manually
	// str := `{
	// 	"docType":"assetPool",
	// 	"id": "` + id + `",
	// }`


	poolAsBytes, _ := json.Marshal(pool)                         //convert to array of bytes
	err = stub.PutState(pool.Id, poolAsBytes)                    //store owner by its Id

	// err = stub.PutState(id, []byte(str))                         //store marble with id as key
	if err != nil {
		return shim.Error(err.Error())
	}
	fmt.Println("- end init_asset_pool")
	return shim.Success(nil)
}

// pool_asset (asset_id, pool_id)

// func loadAssetJSON(stub, id, type) {
// 	objectAsBytes, err := stub.GetState(id)
// 	if err != nil {
// 		return shim.Error("Failed to get asset")
// 	}
// 	object := type{}
// 	json.Unmarshal(objectAsBytes, &object)           //un stringify it aka JSON.parse()
// 	return object
// }
// fmt.Println(reflect.TypeOf("Asset"))

func pool_asset(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting pool_asset")

	// input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}
	var asset_id = args[0]
	var pool_id = args[1]
	// var authed_by_company = args[2]
	// fmt.Println(marble_id + "->" + new_owner_id + " - |" + authed_by_company)

	// check if user already exists
	// owner, err := get_originator(stub, new_owner_id)
	// if err != nil {
	// 	return shim.Error("This owner does not exist - " + new_owner_id)
	// }

	// set pool id in Asset object
	assetAsBytes, err := stub.GetState(asset_id)
	if err != nil {
		return shim.Error("Failed to get asset")
	}
	asset := Asset{}
	json.Unmarshal(assetAsBytes, &asset)           //un stringify it aka JSON.parse()
	asset.Pool = pool_id                   //change the owner
	jsonAsBytes, _ := json.Marshal(asset)           //convert to array of bytes
	err = stub.PutState(asset_id, jsonAsBytes)     //rewrite the marble with id as key
	if err != nil {
		return shim.Error(err.Error())
	}


  // add asset id to "Assets" array in pool
	poolAsBytes, err := stub.GetState(pool_id)
	if err != nil {
		return shim.Error("Failed to get asset pool")
	}
	pool := Pool{}
	json.Unmarshal(poolAsBytes, &pool)           //un stringify it aka JSON.parse()

	assetInArray, _ := InArray(asset.Id, pool.Assets)
	if !assetInArray {
		fmt.Println("adding asset to pool")
		pool.Assets = append(pool.Assets, asset.Id)
		poolAsBytes, _ = json.Marshal(pool)           //convert to array of bytes
		err = stub.PutState(pool_id, poolAsBytes)     //rewrite the marble with id as key
		if err != nil {
			return shim.Error(err.Error())
		}
	} else {
		fmt.Println("asset already in pool, skipping")
	}
	// pool.Assets = append(pool.Assets, asset_id)
	// assetArray := []string{asset_id}  //[]string{pool_id, resPool.Assets}
	// resPool.Assets = assetArray
  // updatedAssets := [string]{resPool.Assets, pool_id}
	// poolAsBytes, _ = json.Marshal(pool)           //convert to array of bytes
	// err = stub.PutState(pool_id, poolAsBytes)     //rewrite the marble with id as key
	// if err != nil {
	// 	return shim.Error(err.Error())
	// }

	fmt.Println("- end pool_asset")
	return shim.Success(nil)
}


// To keep things simple we'll just give ratings of A, B, C
// Ratings should be updated when underwriting information or asset state change
func rate_asset(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting rate_asset")

	// input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}
	var asset_id = args[0]
	// get marble's current state
	assetAsBytes, err := stub.GetState(asset_id)
	if err != nil {
		return shim.Error("Failed to get asset")
	}
	res := Asset{}
	json.Unmarshal(assetAsBytes, &res)           //un stringify it aka JSON.parse()
	// res.Underwriting

	// check authorizing company
	// if res.Owner.Company != authed_by_company{
	// 	return shim.Error("The company '" + authed_by_company + "' cannot authorize transfers for '" + res.Owner.Company + "'.")
	// }

	// for simplicity, lets just use FICO to determine grade
	// 615 minimum
  // FICO, err := strconv.Atoi(res.Underwriting.FICO)
	FICO, err := strconv.Atoi(res.Underwriting)
	rating := ""
	switch {
		case FICO < 615:
		  rating = "C"
		case 615 < FICO && FICO < 699:
		  rating = "B"
		case 700 < FICO:
		  rating = "A"
  }
	res.Rating = rating


	//change the owner
	// res.Underwriting.DebtToIncome
	// res.Owner.Username = owner.Username
	// res.Owner.Company = owner.Company
	jsonAsBytes, _ := json.Marshal(res)           //convert to array of bytes
	err = stub.PutState(args[0], jsonAsBytes)     //rewrite the marble with id as key
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end rate_asset")
	return shim.Success(nil)
}


// https://onlinelibrary.wiley.com/doi/full/10.1002/9780470404324.hof003039
// the value of the security is equal to the value of the expected cash flows

// generate_securities (pool, rating)

// sell_securities (investor, amount)

// function value_securities (investor, pool, amount)

// process_payment (asset)
// each time a payment is processed, security value should drop?
func process_payment(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting process_payment")
	// input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}
	var asset_id = args[0]
	assetAsBytes, err := stub.GetState(asset_id)
	if err != nil {
		return shim.Error("Failed to get asset")
	}
	asset := Asset{}
	fmt.Println("assetAsBytes")
	fmt.Println(string(assetAsBytes))
	err = json.Unmarshal(assetAsBytes, &asset)           //un stringify it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
		// return shim.Error("Failed to unmarshal json")
	}
	originator := Originator{}
	originatorAsBytes, err := stub.GetState(asset.Originator)
	err = json.Unmarshal(originatorAsBytes, &originator)           //un stringify it aka JSON.parse()


	paymentAmount, err := strconv.ParseFloat(args[1], 32)
  balance, err := strconv.ParseFloat(asset.Balance, 32)
	interestRate, err := strconv.ParseFloat(asset.InterestRate, 32)

	processingFee, err := strconv.ParseFloat(originator.ProcessingFee, 32)
	paymentsLeft, err := strconv.Atoi(asset.RemainingPayments)
	// TODO
	// percent.Percent(25, 2000) // return 500
	paymentsPerYear := 12.0 // assuming interest rate is a yearly percentage

	interestPayment := ((balance * interestRate) / paymentsPerYear)
	processingPayment, _ := strconv.ParseFloat(asset.ProcessingPayment, 32) //:= processingFee * paymentAmount
	principalPayment := paymentAmount - interestPayment - processingFee

	// updated := balance - principalPayment
	updatedBalance := balance - principalPayment

  // updatedBalance := strconv.FormatFloat((balance - principalPayment), 'f', 2, 64)

	fmt.Println("initial asset.Balance")
	fmt.Println(asset.Balance)

	asset.Balance = strconv.FormatFloat(updatedBalance, 'f', 2, 64)
	asset.RemainingPayments = strconv.Itoa(paymentsLeft - 1)
	// asset.Balance = updatedBalance
	// investorBalance = strconv.FormatFloat(investor.Balance, 'f', 2, 64)
	assetAsBytes, err = json.Marshal(asset)

	if err != nil {
		fmt.Println("Failed to Marshal asset")
		fmt.Println(err)
		return shim.Error("Failed to Marshal asset")
	}
	fmt.Println("Marshal assetAsBytes")
	fmt.Println(string(assetAsBytes))

	err = stub.PutState(asset.Id, assetAsBytes)
	if err != nil {
		return shim.Error("Failed to save asset")
		fmt.Println("Failed to save asset")
		fmt.Println(err)
	}
	// get investors
	// get originator
	// if asset.Originator != nil {
	// originator = stub.GetState(asset.Originator)
	// originatorBalance, err := strconv.ParseFloat(asset.Originator.Balance, 32)
	fmt.Println("asset.Originator.Balance before")
	fmt.Println(originator.Balance)
	fmt.Println("asset.ProcessingPayment")
	fmt.Println(asset.ProcessingPayment)
	originatorBalance, _ := strconv.ParseFloat(originator.Balance, 32)
	updatedOriginatorBalance := processingPayment + originatorBalance
	originator.Balance = strconv.FormatFloat(updatedOriginatorBalance, 'f', 2, 64)
	originatorAsBytes, err = json.Marshal(originator)
	fmt.Println("asset.Originator.Id")
	err = stub.PutState(asset.Originator, originatorAsBytes)

	// }
	// pay their portion

  // TODO, remove this
	// get remaining assets from pool
	pool_id := asset.Pool
	poolAsBytes, err := stub.GetState(pool_id)
	if err != nil {
		return shim.Error("Failed to get pool")
	}
	pool := Pool{}
	fmt.Println("poolAsBytes")
	fmt.Println(string(poolAsBytes))
	err = json.Unmarshal(poolAsBytes, &pool)           //un stringify it aka JSON.parse()
	fmt.Println("pool")
	fmt.Printf("%+v\n", pool)
	// fmt.Println(pool.Assets)
	// fmt.Println("pool.Investors")
	// fmt.Println(pool.Investors)
	// fmt.Println("security.Investor")
	// TODO, protect against panic when array empty
	// if ( len(pool.Securities) > 0) {
	// 	fmt.Printf("%+v\n", pool.Securities)
	// }
	// fmt.Println("security")
	// fmt.Printf("%+v\n", security)

	for _, security_id := range pool.Securities {

		// load each security and investor
		// increase investor balance
		securityAsBytes, err := stub.GetState(security_id)
		security := Security{}
		err = json.Unmarshal(securityAsBytes, &security)           //un stringify it aka JSON.parse()

		if err != nil {
			return shim.Error("Failed to get security")
		}

		fmt.Println("processingPayment for amount:")
		fmt.Println(processingPayment)
		if security.Investor != "" {
			fmt.Println("fetching investor: " + security.Investor)
			investorAsBytes, err := stub.GetState(security.Investor)
			investor := Investor{}
			json.Unmarshal(investorAsBytes, &investor)           //un stringify it aka JSON.parse()

			investor.Balance = investor.Balance + (security.CouponRate * paymentAmount)
			investorAsBytes, _ = json.Marshal(investor)                         //convert to array of bytes
			fmt.Println("investorAsBytes")
			fmt.Println(string(investorAsBytes))

			err = stub.PutState(investor.Id, investorAsBytes)                    //store owner by its Id
			if err != nil {
				fmt.Println("Could not store investor")
				return shim.Error(err.Error())
			}
		}

		if security.RemainingPayments != "" {
			securityRemainingPayments, err := strconv.Atoi(security.RemainingPayments)
			if err != nil {
				return shim.Error(err.Error())
			}
			securityRemainingPayments = securityRemainingPayments - 1
			security.RemainingPayments = strconv.Itoa(securityRemainingPayments)
			securityAsBytes, _ = json.Marshal(security)
			err = stub.PutState(security.Id, securityAsBytes)                    //store owner by its Id
			if err != nil {
				return shim.Error(err.Error())
			}
		}
		// fmt.Println(pool.Investors)
		// security.investor.balance =+ interestPayment
	}
	// TODO
  // recreate originator with processingfee, test out
	// res.Originator.ProcessingFee, err
	// originatorPayment := processingFee * float64(paymentAmount)
	// res.Pool
  // receipt :=

	// jsonAsBytes, _ := json.Marshal(`"{payment: ` + strconv.FormatFloat(processingPayment, 'f', 2, 64) + `, receipient: ` + asset.Originator.Username + ` }"`)           //convert to array of bytes
	// err = stub.SetEvent("Payment dispersed: ", jsonAsBytes)     //rewrite the marble with id as key
	if err != nil {
		return shim.Error(err.Error())
	}

	// TODO
	// lookup all associated investors and pay them
	// asset -> pool -> derivative (based on rating) -> investor
	//  portion of investor original investment should be returned plus rate of return

	// err = stub.PutState(args[0], jsonAsBytes)     //rewrite the marble with id as key

	// fmt.Println("stub")
	// fmt.Println(stub)
	// f := "invoke"
	// strs := []string{"pool1"}
	// buf := &bytes.Buffer{}
	// gob.NewEncoder(buf).Encode(strs)
	// bs := buf.Bytes()
  //
  //
	// strBytes := [1][1]byte{}
	// strBytes[0][0] = []byte("pool1")
  //
	// strBytes = []byte("pool1")


	// input := []string{"value_pool", "pool1"}
	// output := make([][]byte, len(input))
	// for i, v := range input {
  //   output[i] = []byte(v)
	// }
	// TODO, make the value_pool function a normal one instead of using shim
	// invoke := stub.InvokeChaincode("invoke", output, "")

	// update pool value
	// value_pool(stub, []string{pool.Id})

	// update amortization value
	// value_asset(stub, []string{asset.Id})

	fmt.Println("- end process_payments")
	return shim.Success(nil)
}

// calculate monthly payment required for amortization
// expects interest rate and period
func calculate_monthly_payment(balance float64,  interestRate float64,  months float64) float64 {
	// balance := 450000.00
	monthlyInterestRate := interestRate / 12.0
	// months := 3.0 * 12.0
	monthlyPayment := ((balance * ( monthlyInterestRate * math.Pow((1 + monthlyInterestRate) , months))) / (  ( math.Pow ( (1 + monthlyInterestRate ) , months)) - 1 ))
	return monthlyPayment
}

//
// TODO, this doesn't seem to be working, fix
// func calculate_payments_to_amoritization (balance float64,  interestRate float64, monthlyPayment float64) int {
// 	monthlyInterestRate := interestRate / 12.0
// 	// months := 3.0 * 12.0
// 	// monthlyPayment := ((balance * ( monthlyInterestRate * math.Pow((1 + monthlyInterestRate) , months))) / (  ( math.Pow ( (1 + monthlyInterestRate ) , months)) - 1 ))
// 	paymentsLeft := ( ( -1.0 * math.Log( (1.0 - interest * balance / monthlyPayment ) )) / math.Log( 1 + interestRate) )
// 	return monthlyPayment
// }


// calculate the total value of a pool
// this should be done when a payment is applied toward an asset in a pool, and when an asset is added to a pool
func value_asset_pool(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// Calculates the total amount that a homeowner will pay on their mortgage by amortization
	fmt.Println("start -value_asset_pool")
	asset_id := args[0]
	var err error
	var poolAsBytes []byte
	var assetAsBytes []byte
	var expectedPayoffAmount float64
	// for i := 0; i < retries; i++ {
	// 	fmt.Println("on iteration")
	// 	fmt.Println(i)
	// 	poolAsBytes, err = stub.GetState(pool_id)
  //
	// 	// if err != nil {
	// 	if (len(poolAsBytes) == 0) {
	// 		fmt.Println("Could not load pool, retrying")
	// 		fmt.Println(string(assetAsBytes))
	// 		// return shim.Error(err.Error())
	// 		time.Sleep(2 * time.Second) // adding sleep
	// 	} else {
	// 		fmt.Println("Asset pool loaded, continuing")
	// 		break
	// 	}
	// }
	pool := Pool{}
	asset := Asset{}
	fmt.Println("asset_id")
	fmt.Println(asset_id)

	assetAsBytes, err = stub.GetState(asset_id)
	err = json.Unmarshal(assetAsBytes, &asset)
	fmt.Println("asset")
	fmt.Println(asset)

	poolAsBytes, err = stub.GetState(asset.Pool)
	err = json.Unmarshal(poolAsBytes, &pool)
	fmt.Println("poolAsBytes")
	fmt.Println(string(poolAsBytes))
	fmt.Println("assetAsBytes")
	fmt.Println(string(assetAsBytes))
	if err != nil {
		fmt.Println("Could not load pool")
		return shim.Error(err.Error())
	}
	poolValue := 0.0
	for _, asset_id := range pool.Assets {
		fmt.Println("loading asset")
		fmt.Println(asset_id)
		assetAsBytes, err = stub.GetState(asset_id)
		asset = Asset{}
		err = json.Unmarshal(assetAsBytes, &asset)
		expectedPayoffAmount, _ = strconv.ParseFloat(asset.ExpectedPayoffAmount, 32)
		fmt.Println("expectedPayoffAmount")
		fmt.Println(expectedPayoffAmount)
		poolValue = poolValue + expectedPayoffAmount
	}
	// fmt.Println("setting updated pool value")
	pool.Value = poolValue
	// balance, _ := strconv.ParseFloat(asset.Balance, 32)
	// interest, _ := strconv.ParseFloat(asset.InterestRate, 32)
	// remainingPayments, _ := strconv.ParseFloat(asset.RemainingPayments, 32)
	// trueValue := (((interest / 12.0) * balance * remainingPayments) / (1.0 - math.Pow( ( (1.0 + ( interest / 12.0)) ), (-1.0 * remainingPayments) )))
	// fmt.Println("trueValue")
	// fmt.Println(trueValue)
	// if math.IsNaN(trueValue) {
	// 	fmt.Println("missing parameters")
	// 	return shim.Error("missing parameters")
	// }
	// asset.ExpectedPayoffAmount = strconv.FormatFloat(trueValue, 'f', 2, 64)
	// fmt.Println("write updated pool")
	poolAsBytes, _ = json.Marshal(pool)                         //convert to array of bytes
	err = stub.PutState(pool.Id, poolAsBytes)                    //store owner by its Id
	if err != nil {
		fmt.Println("Could not store pool")
		return shim.Error(err.Error())
	}
	fmt.Println("end -value_asset_pool")
	return shim.Success(nil)
}

// func value_pool(stub shim.ChaincodeStubInterface, args []string) pb.Response {
// 	// Calculates the total amount that a homeowner will pay on their mortgage by amortization
// 	pool_id := args[0]
// 	retries := 5
// 	var err error
// 	var poolAsBytes []byte
// 	var assetAsBytes []byte
// 	var expectedPayoffAmount float64
// 	for i := 0; i < retries; i++ {
// 		fmt.Println("on iteration")
// 		fmt.Println(i)
// 		poolAsBytes, err = stub.GetState(pool_id)
//
// 		// if err != nil {
// 		if (len(poolAsBytes) == 0) {
// 			fmt.Println("Could not load pool, retrying")
// 			fmt.Println(string(assetAsBytes))
// 			// return shim.Error(err.Error())
// 			time.Sleep(2 * time.Second) // adding sleep
// 		} else {
// 			fmt.Println("Asset pool loaded, continuing")
// 			break
// 		}
// 	}
//
// 	// if err != nil {
// 	if (len(poolAsBytes) == 0) {
// 		fmt.Println("Could not load pool after multiple tries, exiting")
// 		// return shim.Error(err.Error())
// 		return shim.Error("Could not load pool after multiple tries, exiting")
// 	}
//
// 	pool := Pool{}
// 	asset := Asset{}
// 	err = json.Unmarshal(poolAsBytes, &pool)
// 	if err != nil {
// 		fmt.Println("Could not load pool")
// 		return shim.Error(err.Error())
// 	}
// 	poolValue := 0.0
// 	for _, asset_id := range pool.Assets {
// 		fmt.Println("loading asset")
// 		fmt.Println(asset_id)
// 		assetAsBytes, err = stub.GetState(asset_id)
// 		asset = Asset{}
// 		expectedPayoffAmount, _ = strconv.ParseFloat(asset.ExpectedPayoffAmount, 32)
// 		fmt.Println("expectedPayoffAmount")
// 		fmt.Println(expectedPayoffAmount)
// 		poolValue = poolValue + expectedPayoffAmount
// 	}
// 	pool.Value = poolValue
// 	// balance, _ := strconv.ParseFloat(asset.Balance, 32)
// 	// interest, _ := strconv.ParseFloat(asset.InterestRate, 32)
// 	// remainingPayments, _ := strconv.ParseFloat(asset.RemainingPayments, 32)
// 	// trueValue := (((interest / 12.0) * balance * remainingPayments) / (1.0 - math.Pow( ( (1.0 + ( interest / 12.0)) ), (-1.0 * remainingPayments) )))
// 	// fmt.Println("trueValue")
// 	// fmt.Println(trueValue)
// 	// if math.IsNaN(trueValue) {
// 	// 	fmt.Println("missing parameters")
// 	// 	return shim.Error("missing parameters")
// 	// }
// 	// asset.ExpectedPayoffAmount = strconv.FormatFloat(trueValue, 'f', 2, 64)
// 	poolAsBytes, _ = json.Marshal(pool)                         //convert to array of bytes
// 	err = stub.PutState(pool.Id, poolAsBytes)                    //store owner by its Id
// 	if err != nil {
// 		fmt.Println("Could not store pool")
// 		return shim.Error(err.Error())
// 	}
// 	return shim.Success(nil)
// }

func value_asset(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// Calculates the total amount that a homeowner will pay on their mortgage by amortization
	asset_id := args[0]
	retries := 5
	var err error
	var assetAsBytes []byte
	for i := 0; i < retries; i++ {
		fmt.Println("on iteration")
		fmt.Println(i)
		assetAsBytes, err = stub.GetState(asset_id)

		// if err != nil {
		if (len(assetAsBytes) == 0) {
			fmt.Println("Could not load asset, retrying")
			fmt.Println(asset_id)
			fmt.Println(string(assetAsBytes))
			// return shim.Error(err.Error())
			time.Sleep(2 * time.Second) // adding sleep
		} else {
			fmt.Println("Asset loaded, continuing")
			break
		}
	}

	// if err != nil {
	if (len(assetAsBytes) == 0) {
		fmt.Println("Could not load asset after multiple tries, exiting")
		// return shim.Error(err.Error())
		return shim.Error("Could not load asset after multiple tries, exiting")
	}

	asset := Asset{}
	err = json.Unmarshal(assetAsBytes, &asset)
	if err != nil {
		fmt.Println("Could not load asset")
		return shim.Error(err.Error())
	}
	balance, _ := strconv.ParseFloat(asset.Balance, 32)
	interest, _ := strconv.ParseFloat(asset.InterestRate, 32)
	remainingPayments, _ := strconv.ParseFloat(asset.RemainingPayments, 32)
	trueValue := (((interest / 12.0) * balance * remainingPayments) / (1.0 - math.Pow( ( (1.0 + ( interest / 12.0)) ), (-1.0 * remainingPayments) )))
	fmt.Println("trueValue")
	fmt.Println(trueValue)
	if math.IsNaN(trueValue) {
		fmt.Println("missing parameters")
		return shim.Error("missing parameters")
	}
	asset.ExpectedPayoffAmount = strconv.FormatFloat(trueValue, 'f', 2, 64)
	assetAsBytes, _ = json.Marshal(asset)                         //convert to array of bytes
	err = stub.PutState(asset.Id, assetAsBytes)                    //store owner by its Id
	if err != nil {
		fmt.Println("Could not store asset")
		return shim.Error(err.Error())
	}
	return shim.Success(nil)
}




func value_security(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("starting value_security")
	security_id = args[0]
	securityAsBytes, err := stub.GetState(security_id)
	security := Security{}
	err = json.Unmarshal(securityAsBytes, &security)           //un stringify it aka JSON.parse()
  // Security value is essentially the expected payout. So, we can get a rough calculation by
	// (PoolValue * SecurityCouponRate) * MonthsUntilMaturity
  // TODO, that doesn't take into account the reduced interest amount
	investorAsBytes, _ := json.Marshal(investor)                         //convert to array of bytes
	err = stub.PutState(investor.Id, investorAsBytes)                    //store owner by its Id
	if err != nil {
		fmt.Println("Could not store investor")
		return shim.Error(err.Error())
	}

	fmt.Println("- end init_investor")
	return shim.Success(nil)
}

// create account number for investor account
func init_investor(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting init_investor")

	//input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	var investor Investor
	investor.Id =  args[0]
	if len(args) > 1 {
		investor.Username = strings.ToLower(args[1])
	}
	fmt.Println(investor)

	//store investor
	investorAsBytes, _ := json.Marshal(investor)                         //convert to array of bytes
	err = stub.PutState(investor.Id, investorAsBytes)                    //store owner by its Id
	if err != nil {
		fmt.Println("Could not store investor")
		return shim.Error(err.Error())
	}

	fmt.Println("- end init_investor")
	return shim.Success(nil)
}

func init_security(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting init_security")

	//input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	var security Security
	fmt.Println(args)
	security.Id = args[0]
	security.CouponRate, err = strconv.ParseFloat(args[1], 32)
	pool_id := args[2]
	security.RemainingPayments = args[3] // hardcoding security life as 3 years for now
	security.Maturity = false

	security.Pool = pool_id

	//store user
	securityAsBytes, _ := json.Marshal(security)                         //convert to array of bytes
	err = stub.PutState(security.Id, securityAsBytes)                    //store owner by its Id
	if err != nil {
		fmt.Println("Could not store security")
		return shim.Error(err.Error())
	}

	poolAsBytes, err := stub.GetState(pool_id)
	if err != nil {
		return shim.Error("Failed to get asset pool")
	}
	pool := Pool{}
	json.Unmarshal(poolAsBytes, &pool)
	pool.Securities = append(pool.Securities, security.Id)
	poolAsBytes, _ = json.Marshal(pool)
	err = stub.PutState(pool_id, poolAsBytes)                    //store owner by its Id
  // pool.Securities[0] = security

	fmt.Println("- end init_security")
	return shim.Success(nil)
}

func InArray(needle interface{}, haystack interface{}) (exists bool, index int) {
	exists = false
	index = -1

	switch reflect.TypeOf(haystack).Kind() {
	case reflect.Slice:
		s := reflect.ValueOf(haystack)

		for i := 0; i < s.Len(); i++ {
			if reflect.DeepEqual(needle, s.Index(i).Interface()) == true {
				index = i
				exists = true
				return
			}
		}
	}

	return
}

func buy_security(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting buy_security")

	// input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}
	var investor_id = args[0]
	var security_id = args[1]

	// load investor
	investorAsBytes, err := stub.GetState(investor_id)
	if err != nil {
		return shim.Error("Failed to get investor")
	}
	investor := Investor{}
	json.Unmarshal(investorAsBytes, &investor)           //un stringify it aka JSON.parse()

  // load security
	securityAsBytes, err := stub.GetState(security_id)
	if err != nil {
		return shim.Error("Failed to get security")
	}
	security := Security{}
	json.Unmarshal(securityAsBytes, &security)           //un stringify it aka JSON.parse()

	securityInArray, _ := InArray(security.Id , investor.Securities)
	if !securityInArray {
		fmt.Println("purchasing security")
		investor.Securities = append(investor.Securities, security.Id)
		investorAsBytes, _ = json.Marshal(investor)           //convert to array of bytes
		err = stub.PutState(investor_id, investorAsBytes)     //rewrite the marble with id as key
		if err != nil {
			return shim.Error(err.Error())
		}
	}

	fmt.Println("setting security investor")
	fmt.Println("security before")
	fmt.Println(security)
	security.Investor = investor.Id
	fmt.Println("security after")
	fmt.Println(security)
	securityAsBytes, _ = json.Marshal(security)           //convert to array of bytes
	err = stub.PutState(security.Id, securityAsBytes)     //rewrite the marble with id as key
	if err != nil {
		return shim.Error(err.Error())
	}
	fmt.Println("- end buy_security")
	return shim.Success(nil)
}
