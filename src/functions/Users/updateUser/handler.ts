import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

const AWS = require("aws-sdk");

import schema from "./schema";
const docClient = new AWS.DynamoDB.DocumentClient();

const updateProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	const userId = event.pathParameters.id;
	const name = event.body.name;
	const email = event.body.email;
	const password = event.body.password;
	const passwordValidation = event.body.passwordValidation;

	if(password !== passwordValidation){
		return formatJSONResponse({
			error: 'As senhas estão diferentes',
		});
	}

	const user = {
		id: userId,
		name: name,
		email: email,
		password: password,
	};

	try {
		const output = await docClient
			.get({
				TableName: "UsersTable",
				Key: {
					id: userId,
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
				TableName: "UsersTable",
				Item: user,
			})
			.promise();
		return formatJSONResponse({
			product: user,
		});
	} catch (error) {
		console.log(error);
		return formatJSONResponse({
			error: error,
		});
	}
};

export const main = middyfy(updateProduct);
