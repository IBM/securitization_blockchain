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
	// "bytes"
	"encoding/json"
	"fmt"
  // "reflect"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// ============================================================================================================================
// Read - read a generic variable from ledger
//
// Shows Off GetState() - reading a key/value from the ledger
//
// Inputs - Array of strings
//  0
//  key
//  "abc"
//
// Returns - string
// ============================================================================================================================
func read(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var key, jsonResp string
	var err error
	fmt.Println("starting read")

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting key of the var to query")
	}

	// input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	key = args[0]
	valAsbytes, err := stub.GetState(key)           //get the var from ledger
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + key + "\"}"
		return shim.Error(jsonResp)
	}

	fmt.Println("Object keys")

	fmt.Println(string(valAsbytes))
	// fmt.Printf("%+v\n", security.Investor)


	fmt.Println("- end read")
	return shim.Success(valAsbytes)                  //send it onward
}

// ============================================================================================================================
// Get everything we need (owners + marbles + companies)
//
// Inputs - none
//
// Returns:
// {
//	"owners": [{
//			"id": "o99999999",
//			"company": "United Marbles"
//			"username": "alice"
//	}],
//	"marbles": [{
//		"id": "m1490898165086",
//		"color": "white",
//		"docType" :"marble",
//		"owner": {
//			"company": "United Marbles"
//			"username": "alice"
//		},
//		"size" : 35
//	}]
// }
// ============================================================================================================================
func read_everything(stub shim.ChaincodeStubInterface) pb.Response {
	type Everything struct {
		Originators   []Originator   `json:"originators"`
		Assets  			[]Asset        `json:"assets"`
		Pools				  []Pool				 `json:"pools"`
		Securities		[]Security		 `json:"securities"`
		Investors     []Investor		 `json:"investors"`
	}
	var everything Everything

	// ---- Get All Marbles ---- //
	assetsIterator, err := stub.GetStateByRange("asset0", "asset9999999999999999999")
	if err != nil {
		return shim.Error(err.Error())
	}
	defer assetsIterator.Close()

	for assetsIterator.HasNext() {
		aKeyValue, err := assetsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		queryKeyAsStr := aKeyValue.Key
		queryValAsBytes := aKeyValue.Value
		fmt.Println("on asset id - ", queryKeyAsStr)
		var asset Asset
		json.Unmarshal(queryValAsBytes, &asset)                  //un stringify it aka JSON.parse()
		everything.Assets = append(everything.Assets, asset)   //add this marble to the list
	}
	fmt.Println("asset array - ", everything.Assets)

	// ---- Get All Originators ---- //
	originatorsIterator, err := stub.GetStateByRange("originator0", "originator9999999999999999999")
	if err != nil {
		return shim.Error(err.Error())
	}
	defer originatorsIterator.Close()

	for originatorsIterator.HasNext() {
		aKeyValue, err := originatorsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		queryKeyAsStr := aKeyValue.Key
		queryValAsBytes := aKeyValue.Value
		fmt.Println("on originator id - ", queryKeyAsStr)
		var originator Originator
		json.Unmarshal(queryValAsBytes, &originator)                   //un stringify it aka JSON.parse()
		everything.Originators = append(everything.Originators, originator)  //add this marble to the list
	}
	fmt.Println("originator array - ", everything.Originators)

	// ---- Get All Pools ---- //
	poolsIterator, err := stub.GetStateByRange("pool0", "pool9999999999999999999")
	if err != nil {
	  return shim.Error(err.Error())
	}
	defer poolsIterator.Close()

	for poolsIterator.HasNext() {
	  aKeyValue, err := poolsIterator.Next()
	  if err != nil {
	    return shim.Error(err.Error())
	  }
	  queryKeyAsStr := aKeyValue.Key
	  queryValAsBytes := aKeyValue.Value
	  fmt.Println("on pool id - ", queryKeyAsStr)
	  var pool Pool
	  json.Unmarshal(queryValAsBytes, &pool)                   //un stringify it aka JSON.parse()
	  everything.Pools = append(everything.Pools, pool)  //add this marble to the list
	}
	fmt.Println("pool array - ", everything.Pools)

	// ---- Get All Securities ---- //
	securitiesIterator, err := stub.GetStateByRange("security0", "security9999999999999999999")
	if err != nil {
	  return shim.Error(err.Error())
	}
	defer securitiesIterator.Close()

	for securitiesIterator.HasNext() {
	  aKeyValue, err := securitiesIterator.Next()
	  if err != nil {
	    return shim.Error(err.Error())
	  }
	  queryKeyAsStr := aKeyValue.Key
	  queryValAsBytes := aKeyValue.Value
	  fmt.Println("on security id - ", queryKeyAsStr)
	  var security Security
	  json.Unmarshal(queryValAsBytes, &security)                   //un stringify it aka JSON.parse()
	  everything.Securities = append(everything.Securities, security)  //add this marble to the list
	}
	fmt.Println("security array - ", everything.Securities)

	// ---- Get All Investors ---- //
	investorsIterator, err := stub.GetStateByRange("investor0", "investor9999999999999999999")
	if err != nil {
	  return shim.Error(err.Error())
	}
	defer investorsIterator.Close()

	for investorsIterator.HasNext() {
	  aKeyValue, err := investorsIterator.Next()
	  if err != nil {
	    return shim.Error(err.Error())
	  }
	  queryKeyAsStr := aKeyValue.Key
	  queryValAsBytes := aKeyValue.Value
	  fmt.Println("on investor id - ", queryKeyAsStr)
	  var investor Investor
	  json.Unmarshal(queryValAsBytes, &investor)                   //un stringify it aka JSON.parse()
	  everything.Investors = append(everything.Investors, investor)  //add this marble to the list
	}
	fmt.Println("investor array - ", everything.Investors)

	//change to array of bytes
	everythingAsBytes, _ := json.Marshal(everything)              //convert to array of bytes
	return shim.Success(everythingAsBytes)
}

// ============================================================================================================================
// Get history of asset
//
// Shows Off GetHistoryForKey() - reading complete history of a key/value
//
// Inputs - Array of strings
//  0
//  id
//  "m01490985296352SjAyM"
// ============================================================================================================================
func getHistory(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	type AuditHistory struct {
		TxId    string   `json:"txId"`
		Value   Asset   `json:"value"`
	}
	var history []AuditHistory;
	var asset Asset

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	assetId := args[0]
	fmt.Printf("- start getHistoryForAsset: %s\n", assetId)

	// Get History
	resultsIterator, err := stub.GetHistoryForKey(assetId)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	for resultsIterator.HasNext() {
		historyData, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		var tx AuditHistory
		tx.TxId = historyData.TxId                     //copy transaction id over
		json.Unmarshal(historyData.Value, &asset)     //un stringify it aka JSON.parse()
		if historyData.Value == nil {                  //marble has been deleted
			var emptyAsset Asset
			tx.Value = emptyAsset                 //copy nil marble
		} else {
			json.Unmarshal(historyData.Value, &asset) //un stringify it aka JSON.parse()
			tx.Value = asset                      //copy marble over
		}
		history = append(history, tx)              //add this tx to the list
	}
	fmt.Printf("- getHistoryForMarble returning:\n%s", history)

	//change to array of bytes
	historyAsBytes, _ := json.Marshal(history)     //convert to array of bytes
	return shim.Success(historyAsBytes)
}

// ============================================================================================================================
// Get history of asset - performs a range query based on the start and end keys provided.
//
// Shows Off GetStateByRange() - reading a multiple key/values from the ledger
//
// Inputs - Array of strings
//       0     ,    1
//   startKey  ,  endKey
//  "marbles1" , "marbles5"
// ============================================================================================================================
// func getMarblesByRange(stub shim.ChaincodeStubInterface, args []string) pb.Response {
// 	if len(args) != 2 {
// 		return shim.Error("Incorrect number of arguments. Expecting 2")
// 	}
//
// 	startKey := args[0]
// 	endKey := args[1]
//
// 	resultsIterator, err := stub.GetStateByRange(startKey, endKey)
// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}
// 	defer resultsIterator.Close()
//
// 	// buffer is a JSON array containing QueryResults
// 	var buffer bytes.Buffer
// 	buffer.WriteString("[")
//
// 	bArrayMemberAlreadyWritten := false
// 	for resultsIterator.HasNext() {
// 		aKeyValue, err := resultsIterator.Next()
// 		if err != nil {
// 			return shim.Error(err.Error())
// 		}
// 		queryResultKey := aKeyValue.Key
// 		queryResultValue := aKeyValue.Value
//
// 		// Add a comma before array members, suppress it for the first array member
// 		if bArrayMemberAlreadyWritten == true {
// 			buffer.WriteString(",")
// 		}
// 		buffer.WriteString("{\"Key\":")
// 		buffer.WriteString("\"")
// 		buffer.WriteString(queryResultKey)
// 		buffer.WriteString("\"")
//
// 		buffer.WriteString(", \"Record\":")
// 		// Record is a JSON object, so we write as-is
// 		buffer.WriteString(string(queryResultValue))
// 		buffer.WriteString("}")
// 		bArrayMemberAlreadyWritten = true
// 	}
// 	buffer.WriteString("]")
//
// 	fmt.Printf("- getMarblesByRange queryResult:\n%s\n", buffer.String())
//
// 	return shim.Success(buffer.Bytes())
// }
