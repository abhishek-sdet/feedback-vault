const connectionString = "postgresql://postgres.tefsmieopnulkqrkvgfs:abhishekjohri@3980@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres";
try {
    const url = new URL(connectionString);
    console.log("Hostname:", url.hostname);
    console.log("Username:", url.username);
    console.log("Password:", url.password);
} catch (e) {
    console.error("Error parsing URL:", e.message);
}
