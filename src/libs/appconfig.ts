/*
* Read config json file and set Config
*/

import * as fs from 'fs';
import * as path from 'path';
import { IConfiguration } from "./typedef";

const basePath = path.join(__dirname, '..','config');
const generalConfPath = path.join(basePath, 'appconfig.json');
export const configuration: IConfiguration = JSON.parse((fs.readFileSync(generalConfPath).toString()));