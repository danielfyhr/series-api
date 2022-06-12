export const handler = async (event: unknown) => {
  console.log("hello world from create handler");
  return {
    body: JSON.stringify({
      message: "Hello there",
    }),
  };
};
