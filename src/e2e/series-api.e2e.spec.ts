import axios, { AxiosError } from "axios";
import { CreateRequest } from "../create.request";

describe("series-api e2e", () => {
  const baseUrl = process.env.SERIES_URL;

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
  it("should create, list, delete", async () => {
    const request: CreateRequest = {
      network: randomName(),
      title: randomName(),
      description: "Action packed",
      rating: 5,
    };

    const postresponse = await axios.post(`${baseUrl}/series`, request);
    const serie = postresponse.data.serie;

    expect(postresponse.status).toEqual(200);
    expect(serie).toEqual({
      network: request.network,
      title: request.title,
      description: request.description,
      rating: request.rating,
    });

    const getresponse = await axios.get(`${baseUrl}/series/${request.network}`);
    expect(getresponse.status).toEqual(200);
    expect(getresponse.data.series).toHaveLength(1);

    const deleteresponse = await axios.delete(
      `${baseUrl}/series/${request.network}/${request.title}`
    );
    expect(deleteresponse.status).toEqual(200);

    const getresponsetwo = await axios.get(
      `${baseUrl}/series/${request.network}`
    );
    expect(getresponsetwo.status).toEqual(200);
    expect(getresponsetwo.data.series).toHaveLength(0);
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
