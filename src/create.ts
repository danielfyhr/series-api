import { APIGatewayEvent } from "aws-lambda";
import { CreateRequest } from "./create.request";

export const handler = async (event: APIGatewayEvent) => {
  console.log("hello world from create handler");
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

  return {
    body: JSON.stringify({ serie }),
  };
};

function parseInput(body: string): CreateRequest | undefined {
  try {
    const request: Partial<CreateRequest> = JSON.parse(body);

    if (
      request &&
      request.network &&
      request.description &&
      request.title &&
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
