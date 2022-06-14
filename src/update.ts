import { APIGatewayEvent } from "aws-lambda";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const dynamoClient = new DocumentClient();
const tableName = process.env.table ?? "";

interface UpdateRequest {
  description?: string;
  rating?: number;
}

export const handler = async (event: APIGatewayEvent) => {
  const network = event.pathParameters?.network;
  const title = event.pathParameters?.title;
  const input = parseInput(event.body ?? "{}");

  if (input == null) {
    return { statusCode: 400 };
  }

  await dynamoClient
    .update({
      TableName: tableName,
      Key: { network, title },
      UpdateExpression: createUpdateExpression(input),
      ExpressionAttributeValues: {
        ":description": input.description,
        ":rating": input.rating,
      },
    })
    .promise();
  return { statusCode: 200 };
};

function parseInput(body: string): UpdateRequest | undefined {
  try {
    const request: Partial<UpdateRequest> = JSON.parse(body);

    if (request && (request.description || request.rating)) {
      return {
        description: request.description,
        rating: request.rating,
      };
    }

    return undefined;
  } catch (e) {
    return undefined;
  }
}

function createUpdateExpression(request: UpdateRequest) {
  const description = request.description
    ? "description = :description"
    : undefined;
  const rating = request.rating ? "rating = :rating" : undefined;
  return `SET ${[description, rating].filter((x) => x != null).join()}`;
}
