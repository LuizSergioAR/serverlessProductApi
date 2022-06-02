import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

const AWS = require("aws-sdk");

import schema from "./schema";
const docClient = new AWS.DynamoDB.DocumentClient();

const updateProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	const name = event.body.name; //"Tv";
	const productId = event.pathParameters.id;

	const product = {
		id: productId,
		name: name,
	};
	try {
		const output = await docClient
			.get({
				TableName: "ProductsTable",
				Key: {
					id: productId,
				},
			})
			.promise();

		if (!output.Item) {
			return {
				statusCode: 404,
				body: JSON.stringify({ error: "not found" }),
			};
		}
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

export const main = middyfy(updateProduct);
