import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Text } from "ink";
import express from "express";
import path from "path";
import fs from "fs";

/// 🚀 Production SPA server (beta sofrware, use at your own risk)
const Main = ({ staticPort, staticPath, indexFile }) => {
	const [prompt, setPrompt] = useState("Server is setting up . . .");

	useEffect(() => {
		if (!fs.existsSync(staticPath)) {
			setPrompt(`ERR: ${staticPath} does not exist`);
			return;
		}

		const indexFilePath = path.resolve(path.join(staticPath, "/", indexFile));

		if (!fs.existsSync(indexFilePath)) {
			setPrompt(`ERR: ${indexFilePath} does not exist`);
			return;
		}

		const server = express();

		server.use(express.json());
		server.use(express.static(staticPath));
		server.get("/*", (req, res) => {
			res.sendFile(indexFilePath);
		});

		server.listen(staticPort, () => {
			setPrompt(`🚀\tReady at http://localhost:${staticPort} . . .`);
		});
	}, []);

	return <Text bold>{prompt}</Text>;
};

Main.propTypes = {
	/// Path of the directory containing the SPA
	staticPath: PropTypes.string,
	/// Port to serve the server
	staticPort: PropTypes.number,
	/// The index file of the SPA
	indexFile: PropTypes.string
};

Main.defaultProps = {
	staticPort: 3000,
	indexFile: "index.html"
};

Main.shortFlags = {
	staticPort: "p",
	indexFile: "f"
};

Main.positionalArgs = ["staticPath"];

export default Main;
