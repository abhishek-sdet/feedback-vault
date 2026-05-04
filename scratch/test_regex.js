const str = "postgresql://postgres.ref:pass@word@aws-1.pooler.supabase.com:6543/postgres";
const match = str.match(/postgresql?:\/\/(.*?):(.*)@(.*?):(\d+)\/(.*)/);
if (match) {
    const [_, user, pass, host, port, db] = match;
    console.log("User:", user);
    console.log("Pass:", pass);
    console.log("Host:", host);
    console.log("Port:", port);
    console.log("DB:", db);
} else {
    console.log("No match");
}
