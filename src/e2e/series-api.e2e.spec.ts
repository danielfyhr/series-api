import axios from "axios";

describe("series-api e2e", () => {
  const baseUrl = process.env.SERIES_URL;
  it("should respond 200 on POST to /series", async () => {
    const response = await axios.post(`${baseUrl}/series`, { name: "test" });
    expect(response.status).toEqual(200);
  });
});
