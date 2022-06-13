import axios, { AxiosError } from "axios";
import { CreateRequest } from "../create.request";

describe("series-api e2e", () => {
  const baseUrl = process.env.SERIES_URL;
  it("should respond 200 on POST to /series", async () => {
    const request: CreateRequest = {
      network: "someflix",
      title: "My favorite E2E",
      description: "Action packed",
      rating: 5,
    };

    const response = await axios.post(`${baseUrl}/series`, request);
    const serie = response.data.serie;

    expect(response.status).toEqual(200);
    expect(serie).toEqual({
      network: request.network,
      title: request.title,
      description: request.description,
      rating: request.rating,
    });
  });

  it("should respond 400 on POST to /series with invalid data", async () => {
    const response = await axios
      .post(`${baseUrl}/series`, { name: "test" })
      .catch((e: AxiosError) => ({ status: e.response?.status }));
    expect(response.status).toEqual(400);
  });
});
