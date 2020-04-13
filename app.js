(function () {
  const user = document.getElementById("user");
  const message = document.getElementById("message");
  const button = document.getElementById("button");
  const socket = io("http://35.157.80.184:8080", { autoConnect: false });

  const isFormValid = () => {
    user.className = user.value ? "" : "error";
    message.className = message.value ? "" : "error";
    return !button.disabled && user.value && message.value;
  };

  const createListElement = (data) => {
    const li = document.createElement("li");
    const message =
      user.value !== data.user ? `${data.user}: ${data.message}` : data.message;
    li.className = user.value !== data.user && "left";
    li.appendChild(document.createTextNode(message));
    return li;
  };

  const toggleButton = (enabled) => {
    button.disabled = enabled;
  };

  socket.on("connect", () => toggleButton(false));

  socket.on("error", () => toggleButton(true));

  socket.on("reconnect", () => toggleButton(false));

  socket.on("message", (data) => {
    document.getElementById("messages").appendChild(createListElement(data));
    window.scrollTo(0, document.body.scrollHeight);
  });

  document.getElementById("chat-form").onsubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      socket.emit("message", { message: message.value, user: user.value });
      message.value = "";
    }
  };

  window.addEventListener("load", () => socket.connect());
})();
