const connectionString = "postgresql://user:pass@word@host:6543/db";
const url = new URL(connectionString);
console.log("Raw Password from URL object:", url.password);
console.log("Decoded Password:", decodeURIComponent(url.password));
