import { APIGatewayEvent } from "aws-lambda";
import { CreateRequest } from "./create.request";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const dynamoClient = new DocumentClient();
const tableName = process.env.table ?? "";

export const handler = async (event: APIGatewayEvent) => {
  const input = parseInput(event.body ?? "{}");
  if (input == null) {
    return { statusCode: 400 };
  }
  const serie = {
    network: input.network,
    title: input.title,
    description: input.description,
    rating: input.rating,
  };

  try {
    await dynamoClient
      .put({
        TableName: tableName,
        Item: serie,
        ConditionExpression:
          "attribute_not_exists(network) and attribute_not_exists(title)",
      })
      .promise();
    return { body: JSON.stringify({ serie }) };
  } catch (error: any) {
    if (error.code === "ConditionalCheckFailedException") {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: "Serie already exists" }),
      };
    }
    throw error;
  }
};

function parseInput(body: string): CreateRequest | undefined {
  try {
    const request: Partial<CreateRequest> = JSON.parse(body);

    if (
      request &&
      request.network &&
      request.title &&
      request.description &&
      request.rating
    ) {
      return {
        network: request.network,
        title: request.title,
        description: request.description,
        rating: request.rating,
      };
    }

    return undefined;
  } catch (e) {
    return undefined;
  }
}
