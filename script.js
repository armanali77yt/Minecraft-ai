async function askAI() {
  const input = document.getElementById("question");
  const chat = document.getElementById("chat-box");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  chat.innerHTML += `<div class="message user">🧍‍♂️ You: ${userMessage}</div>`;
  input.value = "";
  chat.scrollTop = chat.scrollHeight;

  chat.innerHTML += `<div class="message bot">🤔 AI thinking...</div>`;
  chat.scrollTop = chat.scrollHeight;

  const response = await fetch("https://your-backend.vercel.app/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: userMessage })
  });
  const data = await response.json();

  const messages = chat.getElementsByClassName("message");
  messages[messages.length - 1].remove();
  chat.innerHTML += `<div class="message bot">🧠 AI: ${data.answer}</div>`;
  chat.scrollTop = chat.scrollHeight;
}
