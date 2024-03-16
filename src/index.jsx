import * as squint_core from 'squint-cljs/core.js';
import { ActionPanel, Detail, List, Action } from '@raycast/api';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs/promises';
import { execa } from 'execa';
import { useEffect, useState } from 'react';
var list_passes = async function () {
return squint_core.mapv((function (_PERCENT_1) {
return squint_core.subs(_PERCENT_1, 0, (squint_core.count(_PERCENT_1) - 4))
}), squint_core.filter((function (_PERCENT_1) {
return squint_core.re_matches(/.*\.gpg/, _PERCENT_1)
}), (await fs.readdir(path.join(os.homedir(), ".password-store"), ({ "recursive": true })))))
};
var actions = function (path) {
return <ActionPanel><Action title="Copy" onAction={(async function () {
return (await execa("/usr/local/bin/pass", ["-c", path]))
})}></Action><Action title="Copy OTP" onAction={(async function () {
return (await execa("/usr/local/bin/pass", ["otp", "-c", path]))
})}></Action></ActionPanel>
};
var command = function () {
let vec__14 = useState([]);
let state5 = squint_core.nth(vec__14, 0, null);
let set_state6 = squint_core.nth(vec__14, 1, null);
useEffect((function () {
let f7 = (async function () {
return set_state6((await list_passes()))
});
f7();
return undefined
}), []);
return <List>{squint_core.map((function (path) {
return <List.Item icon="list-icon.png" key={path} title={path} actions={actions(path)}></List.Item>
}), state5)}</List>
};
var default$ = command;

export { list_passes, actions, command }
export default default$
