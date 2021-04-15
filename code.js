let onlyTextLayer = 0,
	otherLayer = 0,
	successCount = 0,
	layerCount = figma.currentPage.selection.length;
console.log("Selected:", layerCount);
if (layerCount === 0) figma.closePlugin("Select at least one layer");
figma.currentPage.selection.forEach(node => {
	if (node.type === "TEXT") {
		node.name = "";
		successCount++;
		onlyTextLayer++;
	}
	else if (["FRAME", "GROUP", "COMPONENT_SET", "COMPONENT", "INSTANCE", "BOOLEAN_OPERATION"].includes(node.type)) {
		let nonText = node.findAll(node => node.type === "TEXT");
		console.log("[" + node.name + "]", "TextNode:", nonText.length);
		if (nonText.length === 0) figma.notify(node.name + " doesn't contain text layers", { timeout: 4000 });
		for (var i = 0; i < nonText.length; i++) {
			nonText[i].name = "";
			successCount++;
		}
	}
	else {
		figma.notify(node.name + " cannot contain text layers", { timeout: 4000 });
		otherLayer++;
	}
});
if (onlyTextLayer > 0) console.log("[Separate TextNode]: ", onlyTextLayer);
if (otherLayer > 0) console.log("[Other layers]: ", otherLayer);
if (successCount > 1) {
	figma.notify("✅ " + successCount + " text layer names reset", { timeout: 2000 });
}
else if (successCount === 1) figma.notify("✅ Text layer name reset", { timeout: 2000 });
console.log("Total:", successCount, "text layer names reset");
figma.closePlugin();
