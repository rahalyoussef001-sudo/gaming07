const ftp = require("basic-ftp");
const path = require("path");
const fs = require("fs");

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        console.log("Connecting to FTP server: " + process.env.FTP_SERVER);
        await client.access({
            host: process.env.FTP_SERVER,
            user: process.env.FTP_USERNAME,
            password: process.env.FTP_PASSWORD,
            secure: false // plain FTP to bypass cPanel secure TLS connection blocks
        });
        
        console.log("Connected successfully! Starting sequential upload...");
        
        // Target directory on cPanel
        await client.ensureDir("public_html");
        
        // Recursive sequential uploader
        async function uploadDir(localDirPath, remoteDirPath) {
            await client.ensureDir(remoteDirPath);
            const items = fs.readdirSync(localDirPath);
            
            for (const item of items) {
                // Exclude system files, local configurations, and development audits
                if (
                    item === ".git" || 
                    item === "node_modules" || 
                    item === "deploy.js" || 
                    item === "gaming07_release.zip" || 
                    item === "package.json" || 
                    item === "package-lock.json" || 
                    item === ".gitignore" || 
                    item === ".github" ||
                    item === ".agents" ||
                    item === "gaming07.com-audit" ||
                    item === "blog-strategy" ||
                    item === "cluster-plan.json" ||
                    item === "cluster-plan.md" ||
                    item === "cpanel_deploy_key" ||
                    item === "cpanel_deploy_key.pub" ||
                    item === "indexnow.js"
                ) {
                    continue;
                }
                
                const localPath = path.join(localDirPath, item);
                const remotePath = remoteDirPath + "/" + item;
                const stat = fs.statSync(localPath);
                
                if (stat.isDirectory()) {
                    await uploadDir(localPath, remotePath);
                } else {
                    console.log(`Uploading: ${localPath} --> ${remotePath}`);
                    await client.uploadFrom(localPath, remotePath);
                }
            }
        }
        
        await uploadDir(".", "public_html");
        console.log("🎉 All files synced successfully to cPanel!");
    } catch (err) {
        console.error("❌ Deployment failed:", err);
        process.exit(1);
    } finally {
        client.close();
    }
}

deploy();
