import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const assetsDir = path.resolve("dist", "assets");
const topCount = Number(process.argv[2] ?? 20);

const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getAssets = async () => {
    const names = await readdir(assetsDir);
    const assets = await Promise.all(
        names.map(async (name) => {
            const filePath = path.join(assetsDir, name);
            const fileStat = await stat(filePath);
            return { name, bytes: fileStat.size };
        })
    );

    return assets.sort((a, b) => b.bytes - a.bytes);
};

try {
    const assets = await getAssets();
    const totalBytes = assets.reduce((sum, asset) => sum + asset.bytes, 0);

    console.log(`Bundle assets: ${assets.length} files, ${formatBytes(totalBytes)} total`);
    console.log(`Largest ${Math.min(topCount, assets.length)} assets:`);

    assets.slice(0, topCount).forEach((asset, index) => {
        console.log(`${String(index + 1).padStart(2, " ")}. ${formatBytes(asset.bytes).padStart(9, " ")}  ${asset.name}`);
    });
} catch (error) {
    console.error("Unable to read dist/assets. Run a production build first.");
    throw error;
}
