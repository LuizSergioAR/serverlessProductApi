import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const getAllProducts: ValidatedEventAPIGatewayProxyEvent<void> = async () => {
	try {
		const output = await docClient
			.scan({
				TableName: "UsersTable",
			})
			.promise();

		return formatJSONResponse({
			Item: output.Items,
		});
	} catch (error) {
		return formatJSONResponse({
			error: error,
		});
	}
};

export const main = middyfy(getAllProducts);
