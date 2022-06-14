import { APIGatewayEvent } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const dynamoClient = new DocumentClient();
const tableName = process.env.table ?? "";

export const handler = async (event: APIGatewayEvent) => {
  const network = event.pathParameters?.network;
  const title = event.pathParameters?.title;

  if (network == null || title == null) {
    return { statusCode: 400 };
  }
  await dynamoClient
    .delete({ TableName: tableName, Key: { network, title } })
    .promise();
  return { statusCode: 200 };
};
