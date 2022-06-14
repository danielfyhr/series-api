import axios, { AxiosError } from "axios";
import { CreateRequest } from "../create.request";

describe("series-api e2e", () => {
  const baseUrl = process.env.SERIES_URL;
  it("should respond 200 on POST to /series", async () => {
    const request: CreateRequest = {
      network: randomName(),
      title: randomName(),
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
  it("should respond 409 on POST to /series with existing serie", async () => {
    const request: CreateRequest = {
      network: randomName(),
      title: randomName(),
      description: "Action packed",
      rating: 5,
    };
    const response = await axios.post(`${baseUrl}/series`, request);
    expect(response.status).toEqual(200);
    const conflictResponse = await axios
      .post(`${baseUrl}/series`, request)
      .catch((e: AxiosError) => ({ status: e.response?.status }));
    expect(conflictResponse.status).toEqual(409);
  });
});

function randomName() {
  return new Array(30)
    .fill("")
    .map(() => randomLetter())
    .join("");
}
function randomLetter() {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const randomIndex = Math.round(Math.random() * letters.length);
  return letters[randomIndex];
}
