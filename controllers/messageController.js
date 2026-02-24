const getMessages = require("../queries/getMessages");
const addMessage = require("../queries/addMessage");

exports.showMessages = async (req, res) => {
  const messages = await getMessages();
  res.render("messages", { messages });
};

exports.newMessageForm = (req, res) => {
  res.render("new-message");
};

exports.createMessage = async (req, res) => {
  const { content } = req.body;

  const isMemberOnly = req.body.isMemberOnly === "on";

  await addMessage(content, req.user.id, isMemberOnly);

  res.redirect("/messages");
};