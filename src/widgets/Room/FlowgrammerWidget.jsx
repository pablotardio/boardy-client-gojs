// App.js
import React, { useEffect } from "react";
import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import ParallelLayout from "../../extensions/parallellayout";
import "./Flowgrammer.css"; // contains .diagram-component CSS

const modelFlowBasic = {
	class: "GraphLinksModel",
	linkKeyProperty: "idLinkProp",
	nodeDataArray: [
		{ key: 1, text: "S", category: "Start" },
		{ key: -1, isGroup: true, cat: "For" },
		{ key: 2, text: "For ", category: "For", group: -1 },
		{ key: 3, text: "Action 1", group: -1 },
		{ key: -2, isGroup: true, cat: "If", group: -1 },
		{ key: 4, text: "If", category: "If", group: -2 },
		{ key: 5, text: "Action 2", group: -2 },
		{ key: 6, text: "Action 3", group: -2 },
		{ key: -3, isGroup: true, cat: "For", group: -2 },
		{
			key: 7,
			text: "For (nested)",
			category: "For",
			group: -3,
		},
		{ key: 8, text: "Action 4", group: -3 },
		{ key: 9, text: "", category: "EndFor", group: -3 },
		{ key: 10, text: "", category: "EndIf", group: -2 },
		{ key: 11, text: "Action 5", group: -1 },
		{ key: 12, text: "", category: "EndFor", group: -1 },
		{ key: 13, text: "E", category: "End" },
	],
	linkDataArray: [
		{ from: 1, to: 2 },
		{ from: 2, to: 3 },
		{ from: 3, to: 4 },
		{ from: 4, to: 5, text: "true" },
		{ from: 4, to: 6, text: "false" },
		{ from: 6, to: 7 },
		{ from: 7, to: 8 },
		{ from: 8, to: 9 },
		{ from: 5, to: 10 },
		{ from: 9, to: 10 },
		{ from: 9, to: 7 },
		{ from: 10, to: 11 },
		{ from: 11, to: 12 },
		{ from: 12, to: 2 },
		{ from: 12, to: 13 },
	],
};
// ...
// two custom figures, for "For Each" loops
go.Shape.defineFigureGenerator("ForEach", function (shape, w, h) {
	var param1 = shape ? shape.parameter1 : NaN; // length of triangular area in direction that it is pointing
	if (isNaN(param1)) param1 = 10;
	var d = Math.min(h / 2, param1);
	var geo = new go.Geometry();
	var fig = new go.PathFigure(w, h - d, true);
	geo.add(fig);
	fig.add(new go.PathSegment(go.PathSegment.Line, w / 2, h));
	fig.add(new go.PathSegment(go.PathSegment.Line, 0, h - d));
	fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0));
	fig.add(new go.PathSegment(go.PathSegment.Line, w, 0).close());
	geo.spot1 = go.Spot.TopLeft;
	geo.spot2 = new go.Spot(1, 1, 0, Math.min(-d + 2, 0));
	return geo;
});

go.Shape.defineFigureGenerator("EndForEach", function (shape, w, h) {
	var param1 = shape ? shape.parameter1 : NaN; // length of triangular area in direction that it is pointing
	if (isNaN(param1)) param1 = 10;
	var d = Math.min(h / 2, param1);
	var geo = new go.Geometry();
	var fig = new go.PathFigure(w, d, true);
	geo.add(fig);
	fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
	fig.add(new go.PathSegment(go.PathSegment.Line, 0, h));
	fig.add(new go.PathSegment(go.PathSegment.Line, 0, d));
	fig.add(new go.PathSegment(go.PathSegment.Line, w / 2, 0).close());
	geo.spot1 = new go.Spot(0, 0, 0, Math.min(d, 0));
	geo.spot2 = go.Spot.BottomRight;
	return geo;
});
/**
 * Diagram initialization method, which is passed to the ReactDiagram component.
 * This method is responsible for making the diagram and initializing the model and any templates.
 * The model's data should not be set here, as the ReactDiagram component handles that via the other props.
 */
let myDiagram;
function initDiagram() {
	var $ = go.GraphObject.make;

	// initialize main Diagram
	myDiagram = $(go.Diagram, {
		allowMove: false,
		allowCopy: false,
		SelectionDeleting: function (e) {
			// before a delete happens
			// handle deletions by excising the node and reconnecting the link where the node had been
			new go.List(e.diagram.selection).each(function (part) {
				deletingNode(part);
			});
		},
		layout: $(ParallelLayout, {
			angle: 90,
			layerSpacing: 21,
			nodeSpacing: 30,
		}),
		ExternalObjectsDropped: function (e) {
			// handle drops from the Palette
			var newnode = e.diagram.selection.first();
			if (!newnode) return;
			if (
				!(newnode instanceof go.Group) &&
				newnode.linksConnected.count === 0
			) {
				// when the selection is dropped but not hooked up to the rest of the graph, delete it
				e.diagram.removeParts(e.diagram.selection, false);
			} else {
				e.diagram.commandHandler.scrollToPart(newnode);
			}
		},
		"undoManager.isEnabled": true,
	});

	// dragged nodes are translucent so that the user can see highlighting of links and nodes
	myDiagram.findLayer("Tool").opacity = 0.5;

	// some common styles for most of the node templates
	function nodeStyle() {
		return {
			deletable: false,
			locationSpot: go.Spot.Center,
			mouseDragEnter: function (e, node) {
				var sh = node.findObject("SHAPE");
				if (sh) sh.fill = "lime";
			},
			mouseDragLeave: function (e, node) {
				var sh = node.findObject("SHAPE");
				if (sh) sh.fill = "white";
			},
			mouseDrop: dropOntoNode,
		};
	}

	function shapeStyle() {
		return { name: "SHAPE", fill: "white" };
	}

	function textStyle() {
		return [
			{ name: "TEXTBLOCK", textAlign: "center", editable: true },
			new go.Binding("text").makeTwoWay(),
		];
	}

	// define the Node templates
	myDiagram.nodeTemplate = $(
		// regular action steps
		go.Node,
		"Auto",
		nodeStyle(),
		{ deletable: true }, // override nodeStyle()
		{ minSize: new go.Size(10, 20) },
		$(go.Shape, shapeStyle()),
		$(go.TextBlock, textStyle(), { margin: 4 })
	);

	myDiagram.nodeTemplateMap.add(
		"Start",
		$(
			go.Node,
			"Auto",
			nodeStyle(),
			{ desiredSize: new go.Size(32, 32) },
			$(go.Shape, "Circle", shapeStyle()),
			$(go.TextBlock, textStyle(), "Start")
		)
	);

	myDiagram.nodeTemplateMap.add(
		"End",
		$(
			go.Node,
			"Auto",
			nodeStyle(),
			{ desiredSize: new go.Size(32, 32) },
			$(go.Shape, "Circle", shapeStyle()),
			$(go.TextBlock, textStyle(), "End")
		)
	);

	myDiagram.nodeTemplateMap.add(
		"For",
		$(
			go.Node,
			"Auto",
			nodeStyle(),
			{ minSize: new go.Size(64, 32) },
			$(go.Shape, "ForEach", shapeStyle()),
			$(go.TextBlock, textStyle(), "For", { margin: 4 })
		)
	);

	myDiagram.nodeTemplateMap.add(
		"EndFor",
		$(
			go.Node,
			nodeStyle(),
			$(go.Shape, "EndForEach", shapeStyle(), {
				desiredSize: new go.Size(4, 4),
			})
		)
	);

	myDiagram.nodeTemplateMap.add(
		"While",
		$(
			go.Node,
			"Auto",
			nodeStyle(),
			{ minSize: new go.Size(32, 32) },
			$(go.Shape, "ForEach", shapeStyle(), {
				angle: -90,
				spot2: new go.Spot(1, 1, -6, 0),
			}),
			$(go.TextBlock, textStyle(), "While", { margin: 4 })
		)
	);

	myDiagram.nodeTemplateMap.add(
		"EndWhile",
		$(
			go.Node,
			nodeStyle(),
			$(go.Shape, "Circle", shapeStyle(), { desiredSize: new go.Size(4, 4) })
		)
	);

	myDiagram.nodeTemplateMap.add(
		"If",
		$(
			go.Node,
			"Auto",
			nodeStyle(),
			{ minSize: new go.Size(64, 32) },
			$(go.Shape, "Diamond", shapeStyle()),
			$(go.TextBlock, textStyle(), "If")
		)
	);

	myDiagram.nodeTemplateMap.add(
		"EndIf",
		$(
			go.Node,
			nodeStyle(),
			$(go.Shape, "Diamond", shapeStyle(), {
				desiredSize: new go.Size(4, 4),
			})
		)
	);

	myDiagram.nodeTemplateMap.add(
		"Switch",
		$(
			go.Node,
			"Auto",
			nodeStyle(),
			{ minSize: new go.Size(64, 32) },
			$(go.Shape, "TriangleUp", shapeStyle()),
			$(go.TextBlock, textStyle(), "Switch")
		)
	);

	myDiagram.nodeTemplateMap.add(
		"Merge",
		$(
			go.Node,
			nodeStyle(),
			$(go.Shape, "TriangleDown", shapeStyle(), {
				desiredSize: new go.Size(4, 4),
			})
		)
	);

	function groupColor(cat) {
		switch (cat) {
			case "If":
				return "rgba(255,0,0,0.05)";
			case "For":
				return "rgba(0,255,0,0.05)";
			case "While":
				return "rgba(0,0,255,0.05)";
			default:
				return "rgba(0,0,0,0.05)";
		}
	}

	// define the Group template, required but unseen
	myDiagram.groupTemplate = $(
		go.Group,
		"Auto",
		{
			locationSpot: go.Spot.Center,
			avoidableMargin: 10, // extra space on the sides
			layout: $(ParallelLayout, {
				angle: 90,
				layerSpacing: 24,
				nodeSpacing: 30,
			}),
			mouseDragEnter: function (e, group) {
				var sh = group.findObject("SHAPE");
				if (sh) {
					sh.width = Math.max(20, group.actualBounds.width - 20);
					sh.stroke = "lime";
				}
			},
			mouseDragLeave: function (e, group) {
				var sh = group.findObject("SHAPE");
				if (sh) sh.stroke = null;
			},
			mouseDrop: dropOntoNode,
		},
		$(
			go.Shape,
			"RoundedRectangle",
			{
				fill: "rgba(0,0,0,0.05)",
				strokeWidth: 0,
				spot1: go.Spot.TopLeft,
				spot2: go.Spot.BottomRight,
			},
			new go.Binding("fill", "cat", groupColor)
		),
		$(go.Placeholder),
		$(go.Shape, "LineH", {
			name: "SHAPE",
			height: 0,
			alignment: go.Spot.Bottom,
			stroke: null,
			strokeWidth: 8,
		})
	);

	// // Show the diagram's model in JSON format
	// function save() {
	// 	document.getElementById("mySavedModel").value = myDiagram.model.toJson();
	// 	myDiagram.isModified = false;
	// }
	function load() {
		
		myDiagram.model = go.Model.fromJson(modelFlowBasic);
	}
	// function newDiagram() {
	// 	myDiagram.model = go.GraphObject.make(go.GraphLinksModel, {
	//   linkKeyProperty: "id01", //toFixTheBug
	// 		nodeDataArray: [
	// 			{ key: 1, text: "S", category: "Start" },
	// 			{ key: 2, text: "E", category: "End" },
	// 		],
	// 		linkDataArray: [{ from: 1, to: 2 }],
	// 	});
	// }

	myDiagram.linkTemplate = $(
		go.Link,
		{
			selectable: false,
			deletable: false,
			routing: go.Link.Orthogonal,
			corner: 5,
			toShortLength: 2,
			// links cannot be deleted
			// If a node from the Palette is dragged over this node, its outline will turn green
			mouseDragEnter: function (e, link) {
				if (!isLoopBack(link)) link.isHighlighted = true;
			},
			mouseDragLeave: function (e, link) {
				link.isHighlighted = false;
			},
			// if a node from the Palette is dropped on a link, the link is replaced by links to and from the new node
			mouseDrop: dropOntoLink,
		},
		$(
			go.Shape,
			{ isPanelMain: true, stroke: "transparent", strokeWidth: 8 },
			new go.Binding("stroke", "isHighlighted", function (h) {
				return h ? "lime" : "transparent";
			}).ofObject()
		),
		$(go.Shape, { isPanelMain: true, stroke: "black", strokeWidth: 1.5 }),
		$(go.Shape, { toArrow: "Standard", strokeWidth: 0 })
		// $(go.TextBlock, { segmentIndex: -2, segmentFraction: 0.75, editable: true },
		//   new go.Binding("text").makeTwoWay(),
		//   new go.Binding("background", "text", function(t) { return t ? "white" : null; }))
	);

	function isLoopBack(link) {
		if (!link) return false;
		if (link.fromNode.containingGroup !== link.toNode.containingGroup)
			return false;
		var cat = link.fromNode.category;
		return cat === "EndFor" || cat === "EndWhile" || cat === "EndIf";
	}

	// A node dropped onto a Merge node is spliced into a link coming into that node;
	// otherwise it is spliced into a link that is coming out of that node.
	function dropOntoNode(e, oldnode) {
		if (oldnode instanceof go.Group) {
			var merge = oldnode.layout.mergeNode;
			if (merge) {
				var it = merge.findLinksOutOf();
				while (it.next()) {
					var link = it.value;
					if (
						link.fromNode.containingGroup !== link.toNode.containingGroup
					) {
						dropOntoLink(e, link);
						break;
					}
				}
			}
		} else if (oldnode instanceof go.Node) {
			var cat = oldnode.category;
			if (
				cat === "Merge" ||
				cat === "End" ||
				cat === "EndFor" ||
				cat === "EndWhile" ||
				cat === "EndIf"
			) {
				link = oldnode.findLinksInto().first();
				if (link) dropOntoLink(e, link);
			} else {
				link = oldnode.findLinksOutOf().first();
				if (link) dropOntoLink(e, link);
			}
		}
	}

	// Splice a node into a link.
	// If the new node is of category "For" or "While" or "If", create a Group and splice it in,
	// and add the new node to that group, and add any other desired nodes and links to that group.
	function dropOntoLink(e, oldlink) {
		if (!(oldlink instanceof go.Link)) return;
		var diagram = e.diagram;
		var newnode = diagram.selection.first();
		if (!(newnode instanceof go.Node)) return;
		if (!newnode.isTopLevel) return;
		if (isLoopBack(oldlink)) {
			// can't add nodes into links going back to the "For" node
			diagram.remove(newnode);
			return;
		}

		// var fromnode = oldlink.fromNode;
		var tonode = oldlink.toNode;
		if (newnode.category === "") {
			// add simple step into chain of actions
			newnode.containingGroup = oldlink.containingGroup;
			// Reconnect the existing link to the new node
			oldlink.toNode = newnode;
			// Then add links from the new node to the old node
			if (newnode.category === "If") {
				diagram.model.addLinkData({ from: newnode.key, to: tonode.key });
				diagram.model.addLinkData({ from: newnode.key, to: tonode.key });
			} else {
				diagram.model.addLinkData({ from: newnode.key, to: tonode.key });
			}
		} else if (newnode.category === "For" || newnode.category === "While") {
			// add loop group
			// add group for loop
			var groupdata = { isGroup: true, cat: newnode.category };
			diagram.model.addNodeData(groupdata);
			var group = diagram.findNodeForData(groupdata);
			group.containingGroup = oldlink.containingGroup;
			diagram.select(group);

			newnode.containingGroup = group;

			var enddata = { category: "End" + newnode.category };
			diagram.model.addNodeData(enddata);
			var endnode = diagram.findNodeForData(enddata);
			endnode.containingGroup = group;
			endnode.location = e.documentPoint;

			diagram.model.addLinkData({ from: newnode.key, to: endnode.key });
			diagram.model.addLinkData({ from: endnode.key, to: newnode.key });

			// Reconnect the existing link to the new node
			oldlink.toNode = newnode;
			// Then add a link from the end node to the old node
			diagram.model.addLinkData({ from: endnode.key, to: tonode.key });
		} else if (newnode.category === "If") {
			// add Conditional group
			// add group for conditional
			groupdata = { isGroup: true, cat: newnode.category };
			diagram.model.addNodeData(groupdata);
			group = diagram.findNodeForData(groupdata);
			group.containingGroup = oldlink.containingGroup;
			diagram.select(group);

			newnode.containingGroup = group;

			enddata = { category: "EndIf" };
			diagram.model.addNodeData(enddata);
			endnode = diagram.findNodeForData(enddata);
			endnode.containingGroup = group;
			endnode.location = e.documentPoint;

			var truedata = { from: newnode.key, to: endnode.key, text: "true" };
			diagram.model.addLinkData(truedata);
			// let truelink = diagram.findLinkForData(truedata);
			var falsedata = { from: newnode.key, to: endnode.key, text: "false" };
			diagram.model.addLinkData(falsedata);
			// let falselink = diagram.findLinkForData(falsedata);

			// Reconnect the existing link to the new node
			oldlink.toNode = newnode;
			// Then add a link from the new node to the old node
			diagram.model.addLinkData({ from: endnode.key, to: tonode.key });
		} else if (newnode.category === "Switch") {
			// add multi-way Switch group
			// add group for loop
			groupdata = { isGroup: true, cat: newnode.category };
			diagram.model.addNodeData(groupdata);
			group = diagram.findNodeForData(groupdata);
			group.containingGroup = oldlink.containingGroup;
			diagram.select(group);

			newnode.containingGroup = group;

			enddata = { category: "Merge" };
			diagram.model.addNodeData(enddata);
			endnode = diagram.findNodeForData(enddata);
			endnode.containingGroup = group;
			endnode.location = e.documentPoint;

			var yesdata = { text: "yes,\ndo it" };
			diagram.model.addNodeData(yesdata);
			var yesnode = diagram.findNodeForData(yesdata);
			yesnode.containingGroup = group;
			yesnode.location = e.documentPoint;
			diagram.model.addLinkData({
				from: newnode.key,
				to: yesnode.key,
				text: "yes",
			});
			diagram.model.addLinkData({ from: yesnode.key, to: endnode.key });

			var nodata = { text: "no,\ndon't" };
			diagram.model.addNodeData(nodata);
			var nonode = diagram.findNodeForData(nodata);
			nonode.containingGroup = group;
			nonode.location = e.documentPoint;
			diagram.model.addLinkData({
				from: newnode.key,
				to: nonode.key,
				text: "no",
			});
			diagram.model.addLinkData({ from: nonode.key, to: endnode.key });

			var maybedata = { text: "??" };
			diagram.model.addNodeData(maybedata);
			var maybenode = diagram.findNodeForData(maybedata);
			maybenode.containingGroup = group;
			maybenode.location = e.documentPoint;
			diagram.model.addLinkData({
				from: newnode.key,
				to: maybenode.key,
				text: "maybe",
			});
			diagram.model.addLinkData({ from: maybenode.key, to: endnode.key });

			// Reconnect the existing link to the new node
			oldlink.toNode = newnode;
			// Then add a link from the end node to the old node
			diagram.model.addLinkData({ from: endnode.key, to: tonode.key });
		}
		diagram.layoutDiagram(true);
	}

	function deletingNode(node) {
		// excise node from the chain that it is in
		if (!(node instanceof go.Node)) return;
		if (node instanceof go.Group) {
			var externals = node.findExternalLinksConnected();
			var next = null;
			externals.each(function (link) {
				if (link.fromNode.isMemberOf(node)) next = link.toNode;
			});
			if (next) {
				externals.each(function (link) {
					if (link.toNode.isMemberOf(node)) link.toNode = next;
				});
			}
		} else if (node.category === "") {
			next = node.findNodesOutOf().first();
			if (next) {
				new go.List(node.findLinksInto()).each(function (link) {
					link.toNode = next;
				});
			}
		}
	}

	// initialize Palette
	// const myPalette =
	$(go.Palette, "myPaletteDiv", {
		maxSelectionCount: 1,
		nodeTemplateMap: myDiagram.nodeTemplateMap,
		model: new go.GraphLinksModel([
			{ text: "Action" },
			{ text: "For", category: "For" },
			{ text: "While", category: "While" },
			{ text: "If", category: "If" },
			{ text: "Switch", category: "Switch" },
		]),
	});

	// initialize Overview
	// const myOverview =
	$(go.Overview, "myOverviewDiv", {
		observed: myDiagram,
		contentAlignment: go.Spot.Center,
	});
	load();
	return myDiagram;
}
/**
 * Makes the flowgram empty with only a begin and end
 */
function createNewDiag() {
	myDiagram.model = go.GraphObject.make(go.GraphLinksModel, {
		linkKeyProperty: "id01", //toFixTheBug
		nodeDataArray: [
			{ key: 1, text: "S", category: "Start" },
			{ key: 2, text: "E", category: "End" },
		],
		linkDataArray: [{ from: 1, to: 2 }],
	});
}
/**
 * the function can change the diagram that is being show for another it has a format and is
 * obtained from myDiagram.model.toJson()
 * @param {*} diagramJSON
 */
function setDiagram(diagramJSON) {
	myDiagram.model = go.Model.fromJson(diagramJSON);
}
/**
 * This function will make the diagram editable or not (it can be zoomed yet)
 * @param {boolean} state this can be true or false
 */
const setDiagramReadOnly = (state) => {
	myDiagram.isReadOnly = state;
};
/**
 * This function handles any changes to the GoJS model.
 * It is here that you would make any updates to your React state, which is dicussed below.
 */
function handleModelChange(changes) {
	alert("GoJS model changed!");
}
function getDiagram(){
	return myDiagram;
}
// render function...
function FlowgrammerWidget({ onModelChange, setDiagramController }) {
	useEffect(() => {
		if (setDiagramController !== undefined)
			setDiagramController({
				getDiagram,
				setDiagram,
				handleModelChange,
				setDiagramReadOnly,
				createNewDiag,
			});
		return () => {};
	}, [setDiagramController]);

	return (
		<div>
			<div id="myFlexDiv">
				<div id="myPODiv">
					<div
						id="myPaletteDiv"
						style={{
							backgroundColor: "floralwhite",
							border: "solid 1px black",
						}}
					></div>
					<div
						id="myOverviewDiv"
						style={{
							backgroundColor: "whitesmoke",
							border: "solid 1px black",
						}}
					></div>
				</div>

				<ReactDiagram
					initDiagram={initDiagram}
					divClassName="diagram-component myDiagramDiv"
					// { "class": "GraphLinksModel",
					modelData={modelFlowBasic} //no da
					// nodeDataArray={[{class: "GraphLinksModel"},
					// 	{ key: 1, text: "S", category: "Start" },
					// 	{ key: -1, isGroup: true, cat: "For" },
					// 	{ key: 2, text: "For Each", category: "For", group: -1 },
					// 	{ key: 3, text: "Action 1", group: -1 },
					// 	{ key: -2, isGroup: true, cat: "If", group: -1 },
					// 	{ key: 4, text: "If", category: "If", group: -2 },
					// 	{ key: 5, text: "Action 2", group: -2 },
					// 	{ key: 6, text: "Action 3", group: -2 },
					// 	{ key: -3, isGroup: true, cat: "For", group: -2 },
					// 	{
					// 		key: 7,
					// 		text: "For Each\n(nested)",
					// 		category: "For",
					// 		group: -3,
					// 	},
					// 	{ key: 8, text: "Action 4", group: -3 },
					// 	{ key: 9, text: "", category: "EndFor", group: -3 },
					// 	{ key: 10, text: "", category: "EndIf", group: -2 },
					// 	{ key: 11, text: "Action 5", group: -1 },
					// 	{ key: 12, text: "", category: "EndFor", group: -1 },
					// 	{ key: 13, text: "E", category: "End" },
					// ]}
					// linkDataArray={[
					// 	{ from: 1, to: 2 },
					// 	{ from: 2, to: 3 },
					// 	{ from: 3, to: 4 },
					// 	{ from: 4, to: 5, text: "true" },
					// 	{ from: 4, to: 6, text: "false" },
					// 	{ from: 6, to: 7 },
					// 	{ from: 7, to: 8 },
					// 	{ from: 8, to: 9 },
					// 	{ from: 5, to: 10 },
					// 	{ from: 9, to: 10 },
					// 	{ from: 9, to: 7 },
					// 	{ from: 10, to: 11 },
					// 	{ from: 11, to: 12 },
					// 	{ from: 12, to: 2 },
					// 	{ from: 12, to: 13 },
					// ]}
					onModelChange={onModelChange}
				/>
				{/* <button onClick={() => console.log(myDiagram.model.toJson())}>
					{" "}
					Imprimir Modelo
				</button> */}
				{/* <button onClick={() => createNewDiag()}> nuevo</button> */}
			</div>
			
			{/* <textarea id="mySavedModel" style={{ width: "100%", height: "200px" }}>
				{}
			</textarea> */}
		</div>
	);
}
export default FlowgrammerWidget;
