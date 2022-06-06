import type { AWS } from "@serverless/typescript";

import createProduct from "@functions/Products/createProduct";
import getProduct from "@functions/Products/getProduct";
import getAllProducts from "@functions/Products/getAllProducts"; 
import deleteProduct from "@functions/Products/deleteProduct";
import updateProduct from "@functions/Products/updateProduct";

import createUser from "@functions/Users/createUser";
import getUser from "@functions/Users/getUser";
import getAllUsers from "@functions/Users/getAllUsers"; 
import deleteUser from "@functions/Users/deleteUser";
import updateUser from "@functions/Users/updateUser";

const serverlessConfiguration: AWS = {
	service: "serverlessapi",
	frameworkVersion: "3",
	plugins: ["serverless-esbuild"],
	resources: {
		Resources: {
			ProdutsDynamoTable: {
				Type: "AWS::DynamoDB::Table",
				Properties: {
					TableName: "ProductsTable",
					AttributeDefinitions: [
						{
							AttributeName: "id",
							AttributeType: "S",
						},
					],
					KeySchema: [
						{
							AttributeName: "id",
							KeyType: "HASH",
						},
					],
					ProvisionedThroughput: {
						ReadCapacityUnits: 1,
						WriteCapacityUnits: 1,
					},
				},
			},
			UsersDynamoTable: {
				Type: "AWS::DynamoDB::Table",
				Properties: {
					TableName: "UsersTable",
					AttributeDefinitions: [
						{
							AttributeName: "id",
							AttributeType: "S",
						},
					],
					KeySchema: [
						{
							AttributeName: "id",
							KeyType: "HASH",
						},
					],
					ProvisionedThroughput: {
						ReadCapacityUnits: 1,
						WriteCapacityUnits: 1,
					},
				},
			},
		},
	},

	provider: {
		name: "aws",
		runtime: "nodejs14.x",
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
			NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
		},
		iam: {
			role: {
				statements: [
					{
						Effect: "Allow",
						Action: [
							"dynamodb:PutItem",
							"dynamodb:GetItem",
							"dynamodb:DeleteItem",
							"dynamodb:Scan",
						],
						Resource:
							"arn:aws:dynamodb:us-east-1:964257865134:table/*",
					},
				],
			},
		},
	},
	// import the function via paths
	functions: { createProduct, getProduct, getAllProducts, deleteProduct, updateProduct, createUser, getUser, getAllUsers, deleteUser, updateUser },
	package: { individually: true },
	custom: {
		esbuild: {
			bundle: true,
			minify: false,
			sourcemap: true,
			exclude: ["aws-sdk"],
			target: "node14",
			define: { "require.resolve": undefined },
			platform: "node",
			concurrency: 10,
		},
	},
};

module.exports = serverlessConfiguration;
