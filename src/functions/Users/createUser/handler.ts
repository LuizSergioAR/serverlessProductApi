import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { v4 } from "uuid";

const AWS = require("aws-sdk");

import schema from "./schema";
const docClient = new AWS.DynamoDB.DocumentClient();

const createUser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
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
		id: v4(),
		name: name,
		email: email,
		password: password,
	};

	try {
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

export const main = middyfy(createUser);
