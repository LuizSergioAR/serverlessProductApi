import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const getProduct: ValidatedEventAPIGatewayProxyEvent<void> = async (
	event
) => {
	const id = event.pathParameters.id

    const output = await docClient.get({
		TableName: "ProductsTable",
		key:{
            id: id
        }
	});

    if(!output.Item){
        return{
            statusCode: 404,
            body: JSON.stringify({error: 'not found'})
        }
    }

	return formatJSONResponse({
		Item : output.Item
	});
};

export const main = middyfy(getProduct);
