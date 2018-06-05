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
	// "reflect"

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
// func delete_marble(stub shim.ChaincodeStubInterface, args []string) (pb.Response) {
// 	fmt.Println("starting delete_marble")
//
// 	if len(args) != 2 {
// 		return shim.Error("Incorrect number of arguments. Expecting 2")
// 	}
//
// 	// input sanitation
// 	err := sanitize_arguments(args)
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}
//
// 	id := args[0]
// 	authed_by_company := args[1]
//
// 	// get the marble
// 	marble, err := get_asset(stub, id)
// 	if err != nil{
// 		fmt.Println("Failed to find marble by id " + id)
// 		return shim.Error(err.Error())
// 	}
//
// 	// check authorizing company (see note in set_owner() about how this is quirky)
// 	if marble.Owner.Company != authed_by_company{
// 		return shim.Error("The company '" + authed_by_company + "' cannot authorize deletion for '" + marble.Owner.Company + "'.")
// 	}
//
// 	// remove the marble
// 	err = stub.DelState(id)                                                 //remove the key from chaincode state
// 	if err != nil {
// 		return shim.Error("Failed to delete state")
// 	}
//
// 	fmt.Println("- end delete_marble")
// 	return shim.Success(nil)
// }

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

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}

	//input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	id := args[0]
	// initial_amount := args[1] //strings.ToLower(args[1])
	balance := args[1]
	// state := args[2]
	interest := args[2]
	// underwriting, err := json.Marshal(args[5])  //make(map(args[5]))
	underwriting := args[3]  //make(map(args[5]))
	state := "active"
	// originator := ""
	// if len(args) > 5 {
	//   originator = args[5]
	// }

	// size, err := strconv.Atoi(args[2])
	if err != nil {
		return shim.Error("Failure parsing underwriting information")
	}

	//check if new owner exists
	// owner, err := get_owner(stub, owner_id)
	// if err != nil {
	// 	fmt.Println("Failed to find owner - " + owner_id)
	// 	return shim.Error(err.Error())
	// }

	//check authorizing company (see note in set_owner() about how this is quirky)
	// if owner.Company != authed_by_company{
	// 	return shim.Error("The company '" + authed_by_company + "' cannot authorize creation for '" + owner.Company + "'.")
	// }

	//check if marble id already exists
	// asset, err := get_asset(stub, id)
	// if err == nil { // TODO, uncomment
	// 	fmt.Println("This asset already exists - " + id)
	// 	fmt.Println(asset)
	// 	return shim.Error("This asset already exists - " + id)  //all stop a marble by this id exists
	// }

	//build the marble json string manually
	str := `{
		"docType":"asset",
		"id": "` + id + `",
		"state": "` + state + `",
		"interest": "` + interest + `",
		"balance": "` + balance + `",
		"underwriting":"` + underwriting + `"
	}`
	err = stub.PutState(id, []byte(str))                         //store marble with id as key
	if err != nil {
		return shim.Error(err.Error())
	}
	fmt.Println("- end init_asset")
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
	originator.ObjectType = "asset_originator"
	originator.Id =  args[0]
	originator.Username = strings.ToLower(args[1])
	originator.Company = args[2]
	originator.ProcessingFee = args[3]

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
	// var authed_by_company = args[2]
	// fmt.Println(marble_id + "->" + new_owner_id + " - |" + authed_by_company)

	// check if user already exists
	// owner, err := get_originator(stub, new_owner_id)
	// if err != nil {
	// 	return shim.Error("This owner does not exist - " + new_owner_id)
	// }

	// get marble's current state
	assetAsBytes, err := stub.GetState(asset_id)

	if err != nil {
		return shim.Error("Failed to get asset")
	}
	asset := Asset{}
	err = json.Unmarshal(assetAsBytes, &asset)           //un stringify it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	originatorAsBytes, err := stub.GetState(originator_id)
	if err != nil {
		return shim.Error("Failed to get originator")
	}
	originator := Originator{}
	json.Unmarshal(originatorAsBytes, &originator)           //un stringify it aka JSON.parse()

  fmt.Println("asset")
	fmt.Println(asset)
  fmt.Println("originator")
	fmt.Println(originator)

	// check authorizing company
	// if res.Owner.Company != authed_by_company{
	// 	return shim.Error("The company '" + authed_by_company + "' cannot authorize transfers for '" + res.Owner.Company + "'.")
	// }

	// transfer the marble
	asset.Originator = originator                   //change the owner
	// res.Owner.Username = owner.Username
	// res.Owner.Company = owner.Company
	jsonAsBytes, _ := json.Marshal(asset)           //convert to array of bytes
	err = stub.PutState(asset_id, jsonAsBytes)     //rewrite the marble with id as key
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
	pool.Assets = append(pool.Assets, asset_id)
	// assetArray := []string{asset_id}  //[]string{pool_id, resPool.Assets}
	// resPool.Assets = assetArray
  // updatedAssets := [string]{resPool.Assets, pool_id}
	poolAsBytes, _ = json.Marshal(pool)           //convert to array of bytes
	err = stub.PutState(pool_id, poolAsBytes)     //rewrite the marble with id as key
	if err != nil {
		return shim.Error(err.Error())
	}
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

// value_securities (investor, pool, amount)

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

	paymentAmount, err := strconv.ParseFloat(args[1], 32)
  balance, err := strconv.ParseFloat(asset.Balance, 32)
	interestRate, err := strconv.ParseFloat(asset.InterestRate, 32)
	processingFee, err := strconv.ParseFloat(asset.Originator.ProcessingFee, 32)

	// TODO
	// percent.Percent(25, 2000) // return 500
	paymentsPerYear := 12.0 // assuming interest rate is a yearly percentage

	interestPayment := ((balance * interestRate) / paymentsPerYear)
	processingPayment := processingFee * paymentAmount
	principalPayment := paymentAmount - interestPayment - processingFee

	// updated := balance - principalPayment
	updatedBalance := balance - principalPayment
  // updatedBalance := strconv.FormatFloat((balance - principalPayment), 'f', 2, 64)
	asset.Balance = strconv.FormatFloat(updatedBalance, 'f', 2, 64)

	fmt.Println("processingFee")
	fmt.Println(processingFee)
	fmt.Println("paymentAmount")
	fmt.Println(paymentAmount)


	fmt.Println("asset.Balance")
	fmt.Println(asset.Balance)
	fmt.Println("asset")
	fmt.Printf("%+v\n", asset)

	jsonAsBytes, _ := json.Marshal(asset)
	err = stub.PutState(asset.Id, jsonAsBytes)

	// get investors
	// get originator
	// pay their portion

  // TODO, remove this
	// get remaining assets from pool
	// actually no, we don't care about other assets, we care about investors getting their portion
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
	fmt.Println("pool.Securities")
	fmt.Println(pool.Securities)

	fmt.Printf("%+v\n", pool.Securities)


	fmt.Println("security.Investor")
	// TODO, protect against panic when array empty
	if ( len(pool.Securities) > 0) {
		fmt.Printf("%+v\n", pool.Securities)
	}
	// fmt.Println("security")
	// fmt.Printf("%+v\n", security)

	for _, security_id := range pool.Securities {

		// load each security and investor
		// increase investor balance
		securityAsBytes, err := stub.GetState(security_id)
		security := Security{}
		err = json.Unmarshal(securityAsBytes, &security)           //un stringify it aka JSON.parse()

		fmt.Println("processingPayment for amount:")
		fmt.Println(processingPayment)

		// fmt.Println(security.Investor.Balance)
		investorAsBytes, err := stub.GetState(security.Investor)
		investor := Investor{}
		json.Unmarshal(investorAsBytes, &investor)           //un stringify it aka JSON.parse()

		fmt.Println("beginning balance")
		fmt.Println(investor.Balance)
		investor.Balance = processingPayment + investor.Balance
		fmt.Println("updated balance")
		fmt.Println(investor.Balance)


		fmt.Println("Security keys")
		fmt.Printf("%+v\n", security)

		fmt.Println("Investor keys")
		fmt.Printf("%+v\n", security.Investor)


		fmt.Println("investor")
		fmt.Println(investor)
		fmt.Println("investor.Username")
		fmt.Println(investor.Username)
		fmt.Println("investor.Balance")
		fmt.Println(investor.Balance)
		fmt.Println("investor.Id")
		fmt.Println(investor.Id)

		investorAsBytes, _ = json.Marshal(investor)                         //convert to array of bytes
		fmt.Println("investorAsBytes")
		fmt.Println(string(investorAsBytes))

		err = stub.PutState(investor.Id, investorAsBytes)                    //store owner by its Id
		if err != nil {
			fmt.Println("Could not store investor")
			return shim.Error(err.Error())
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

	jsonAsBytes, _ = json.Marshal(`"{payment: ` + strconv.FormatFloat(processingPayment, 'f', 2, 64) + `, receipient: ` + asset.Originator.Username + ` }"`)           //convert to array of bytes
	err = stub.SetEvent("Payment dispersed: ", jsonAsBytes)     //rewrite the marble with id as key
	if err != nil {
		return shim.Error(err.Error())
	}

	// TODO
	// lookup all associated investors and pay them
	// asset -> pool -> derivative (based on rating) -> investor
	//  portion of investor original investment should be returned plus rate of return

	// err = stub.PutState(args[0], jsonAsBytes)     //rewrite the marble with id as key

	fmt.Println("- end process_payment")
	return shim.Success(nil)
}

// create account number for investor account
func init_investor(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting init_investor")

	// if len(args) != 3 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 3")
	// }

	//input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	var investor Investor
	investor.ObjectType = "asset_investor"
	investor.Id =  args[0]
	investor.Username = strings.ToLower(args[1])
	// investor.Company = args[2]
	// originator.Enabled = true
	fmt.Println(investor)

	//check if user already exists
	// _, err = get_investor(stub, investor.Id)
	// if err == nil {
	// 	fmt.Println("This investor already exists - " + investor.Id)
	// 	return shim.Error("This investor already exists - " + investor.Id)
	// }

	//store user
	investorAsBytes, _ := json.Marshal(investor)                         //convert to array of bytes
	err = stub.PutState(investor.Id, investorAsBytes)                    //store owner by its Id
	if err != nil {
		fmt.Println("Could not store investor")
		return shim.Error(err.Error())
	}

	fmt.Println("- end init_investor")
	return shim.Success(nil)
}

func init_securities(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting init_securities")

	// if len(args) != 3 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 3")
	// }

	//input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	var security Security
	// security.Rating = "asset_investor"
	security.Id = args[0]
	security.CouponRate, err = strconv.ParseFloat(args[1], 32)
	pool_id := args[2]
	security.Maturity = false // TODO, maturity is end of life for a loan, not a security
	security.MonthsUntilMaturity = 3 * 12 // hardcoding security life as 3 years for now
	// investor.Company = args[2]
	// originator.Enabled = true
	//check if user already exists
	// _, err = get_security(stub, security.Id)
	// if err == nil {
	// 	fmt.Println("This security already exists - " + security.Id)
	// 	return shim.Error("This security already exists - " + security.Id)
	// }



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

	fmt.Println("- end init_securities")
	return shim.Success(nil)
}

// buy_securities (investor, pool, amount)
func buy_securities(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting buy_securities")

	// input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}
	var investor_id = args[0]
	var security_id = args[1]
	// var authed_by_company = args[2]
	// fmt.Println(marble_id + "->" + new_owner_id + " - |" + authed_by_company)

	// check if user already exists
	// owner, err := get_originator(stub, new_owner_id)
	// if err != nil {
	// 	return shim.Error("This owner does not exist - " + new_owner_id)
	// }

	// set pool id in Asset object
	investorAsBytes, err := stub.GetState(investor_id)
	if err != nil {
		return shim.Error("Failed to get investor")
	}
	investor := Investor{}
	json.Unmarshal(investorAsBytes, &investor)           //un stringify it aka JSON.parse()
	// jsonAsBytes, _ := json.Marshal(asset)           //convert to array of bytes
	// err = stub.PutState(asset_id, jsonAsBytes)     //rewrite the marble with id as key
	// if err != nil {
	// 	return shim.Error(err.Error())
	// }


  // add asset id to "Assets" variable in pool
	securityAsBytes, err := stub.GetState(security_id)
	if err != nil {
		return shim.Error("Failed to get asset pool")
	}
	security := Security{}
	json.Unmarshal(securityAsBytes, &security)           //un stringify it aka JSON.parse()


	security.Investor = investor.Id
	fmt.Println("security.Investor")
	fmt.Printf("%+v\n", security.Investor)
	fmt.Println("security")
	fmt.Printf("%+v\n", security)



	// assetArray := []string{asset_id}  //[]string{pool_id, resPool.Assets}
	// resPool.Assets = assetArray
  // updatedAssets := [string]{resPool.Assets, pool_id}
	securityAsBytes, _ = json.Marshal(security)           //convert to array of bytes
	err = stub.PutState(security_id, securityAsBytes)     //rewrite the marble with id as key
	if err != nil {
		return shim.Error(err.Error())
	}
	fmt.Println("- end buy_securities")
	return shim.Success(nil)
}

// ============================================================================================================================
// Disable Marble Owner
//
// Shows off PutState()
//
// Inputs - Array of Strings
//       0     ,        1
//  owner id       , company that auth the transfer
// "o9999999999999", "united_mables"
// ============================================================================================================================
// func disable_owner(stub shim.ChaincodeStubInterface, args []string) pb.Response {
// 	var err error
// 	fmt.Println("starting disable_owner")
//
// 	if len(args) != 2 {
// 		return shim.Error("Incorrect number of arguments. Expecting 2")
// 	}
//
// 	// input sanitation
// 	err = sanitize_arguments(args)
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}
//
// 	var owner_id = args[0]
// 	var authed_by_company = args[1]
//
// 	// get the marble owner data
// 	owner, err := get_owner(stub, owner_id)
// 	if err != nil {
// 		return shim.Error("This owner does not exist - " + owner_id)
// 	}
//
// 	// check authorizing company
// 	if owner.Company != authed_by_company {
// 		return shim.Error("The company '" + authed_by_company + "' cannot change another companies marble owner")
// 	}
//
// 	// disable the owner
// 	owner.Enabled = false
// 	jsonAsBytes, _ := json.Marshal(owner)         //convert to array of bytes
// 	err = stub.PutState(args[0], jsonAsBytes)     //rewrite the owner
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}
//
// 	fmt.Println("- end disable_owner")
// 	return shim.Success(nil)
// }
