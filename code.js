const startTime = new Date().getTime();
let groupingLayerArray = [],
	emptyLayerArray = [],
	otherLayerArray = [],
	onlyTextLayer = 0,
	successCount = 0,
	layerCount = figma.currentPage.selection.length;
console.log("Selected:", layerCount);
if (layerCount === 0) figma.closePlugin("Select at least one layer");
figma.currentPage.selection.forEach(node => {
	if (node.type === "TEXT") {
		node.name = "";
		onlyTextLayer++;
		successCount++;
	}
	else if (["FRAME", "GROUP", "COMPONENT_SET", "COMPONENT", "INSTANCE", "BOOLEAN_OPERATION"].includes(node.type)) {
		let nonTextLayer = node.findAll(node => node.type === "TEXT");
		if (nonTextLayer.length > 0) groupingLayerArray.push([node.name, nonTextLayer.length]);
		else emptyLayerArray.push(node.name);
		for (var i = 0; i < nonTextLayer.length; i++) {
			nonTextLayer[i].name = "";
			successCount++;
		}
	}
	else otherLayerArray.push(node.name);
});
if (successCount > 1) figma.notify("✅ " + successCount + " text layer names reset", { timeout: 3000 });
else if (successCount === 1) figma.notify("✅ Text layer name reset", { timeout: 3000 });
if (emptyLayerArray.length > 3) figma.notify('"' + emptyLayerArray[0] + '", "' + emptyLayerArray[1] + '" and ' + (emptyLayerArray.length - 2) + ' more objects don\'t contain text layers', { timeout: 5000 });
else {
	for (var el of emptyLayerArray) {
		figma.notify('"' + el + '" doesn\'t contain text layers', { timeout: 3000 });
	}
}
if (otherLayerArray.length > 3) figma.notify('"' + otherLayerArray[0] + '", "' + otherLayerArray[1] + '" and ' + (otherLayerArray.length - 2) + ' more objects cannot contain text layers', { timeout: 5000 });
else {
	for (var el of otherLayerArray) {
		figma.notify('"' + el + '" cannot contain text layers', { timeout: 3000 });
	}
}
if (onlyTextLayer > 0) console.log("%c[Separate TextNode]:", "color: #18a0fb", onlyTextLayer);
if (groupingLayerArray.length > 0) {
	let sum = 0;
	for (var i = 0; i < groupingLayerArray.length; i++) {
		sum += groupingLayerArray[i][1];
	}
	console.log("%c[Grouping layers TextNode]:", "color: #18a0fb", sum, groupingLayerArray);
}
if (emptyLayerArray.length > 0) console.log("%c[Empty layers]:", "color: #fbcc18", emptyLayerArray);
if (otherLayerArray.length > 0) console.log("%c[Other empty layers]:", "color: #fbcc18", otherLayerArray);
const endTime = new Date().getTime();
console.log("Total:", successCount, "text layer names reset. \nTime:", (endTime - startTime)/1000, 'sec.');
figma.closePlugin();
