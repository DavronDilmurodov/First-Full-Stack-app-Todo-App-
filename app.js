const http = require("http");
const bodyParser = (req) => {
  return new Promise((resolve, reject) => {
    req.on("data", (data) => {
      resolve(JSON.parse(data));
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
};

let users = [];
http
  .createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.statusCode = 200;
      res.end();
      return;
    }

    if (req.method === "GET") {
      res.statusCode = 200;
      res.end(JSON.stringify(users));
    } else if (req.method === "POST") {
      req.body = await bodyParser(req);
      users.push(req.body);
      res.statusCode = 201;
      res.end(JSON.stringify(users));
    } else if (req.method === "PUT") {
      req.body = await bodyParser(req);
      const { task, id } = req.body;
      const newUsers = users.map((user) => {
        if (user.id === id) {
          user.task = task;
        }
        return user;
      });
      users = newUsers;
      res.end(JSON.stringify(users));
    } else if (req.method === "DELETE") {
      req.body = await bodyParser(req);
      const { id } = req.body;
      const newUsers = users.filter((user) => user.id !== id);
      users = newUsers;

      res.end(JSON.stringify(users));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "NOT FOUND" }));
    }
  })
  .listen(4000, "localhost", () => {
    console.log("Server is running on 4000 port");
  });
