import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const getUser: ValidatedEventAPIGatewayProxyEvent<void> = async (event) => {
	const idValue = event.pathParameters.id;

	try {
		const output = await docClient
			.get({
				TableName: "UsersTable",
				Key: {
					id: idValue,
				},
			})
			.promise();

		if (!output.Item) {
			return {
				statusCode: 404,
				body: JSON.stringify({ error: "not found" }),
			};
		}

		return formatJSONResponse({
			Item: output.Item,
		});
	} catch (error) {
		return {
			statusCode: 404,
			body: JSON.stringify({ error: error }),
		};
	}
};

export const main = middyfy(getUser);
