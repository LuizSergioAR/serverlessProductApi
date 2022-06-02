import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const deleteProduct: ValidatedEventAPIGatewayProxyEvent<void> = async (
	event
) => {
	const idValue = event.pathParameters.id;

	try {
		const output = await docClient
			.get({
				TableName: "ProductsTable",
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

		await docClient
			.delete({
				TableName: "ProductsTable",
				Key: {
					id: idValue,
				},
			})
			.promise();

		return formatJSONResponse({
            message: 'Produto deletado com sucesso',
			Item: output.Item,
		});
	} catch (error) {
		return {
			statusCode: 404,
			body: JSON.stringify({ error: error }),
		};
	}
};

export const main = middyfy(deleteProduct);
