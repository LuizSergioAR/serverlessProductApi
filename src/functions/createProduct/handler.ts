import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { v4 } from "uuid";

const AWS = require("aws-sdk");

import schema from "./schema";
const docClient = new AWS.DynamoDB.DocumentClient();

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	const name = event.body.name; //"Tv"; 

	const product = {
		id: v4(),
		name: name,
	};
	try {
		await docClient
			.put({
				TableName: "ProductsTable",
				Item: product,
			})
			.promise();
		return formatJSONResponse({
			product: product,
		});
	} catch (error) {
		console.log(error);
		return formatJSONResponse({
			error: error,
		});
	}
};

export const main = middyfy(createProduct);
