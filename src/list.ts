import { APIGatewayEvent } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const dynamoClient = new DocumentClient();
const tableName = process.env.table ?? "";

export const handler = async (event: APIGatewayEvent) => {
  const network = event.pathParameters?.network;

  if (network == null) {
    return { statusCode: 400 };
  }
  const response = await dynamoClient
    .query({
      TableName: tableName,
      KeyConditionExpression: "network = :network",
      ExpressionAttributeValues: { ":network": network },
    })
    .promise();
  const series = response.Items ?? [];
  return { body: JSON.stringify({ series }) };
};
