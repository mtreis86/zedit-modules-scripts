/* global ngapp, xelib */
registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
    },
    execute: (patch, helpers, settings, locals) => ({
        initialize: (patchFile, helpers, settings, locals) => {
            locals.entries = [];
        },
        process: [{
            load: () => ({
                signature: 'RACE',
                filter: (record) => {
                    const health = xelib.GetValue(record, "DATA\\Starting Health");
                    if (!health) {
                        return false;
                        }
                    helpers.logMessage("Processing " + xelib.LongName(record));
                    let entry = new String("".concat(xelib.GetValue(record, "EDID - Editor ID"), "\,",
                                                     Math.round(xelib.GetValue(record, "DATA\\Starting Health")), "\n"));
                    locals.entries.push(entry);
                }
            })
        }],
        finalize: (patchFile, helpers, settings, locals) => {
            let outputText = new String (locals.entries);
            let dataPath = xelib.GetGlobal('DataPath');
            let filePath = fh.jetpack.path(dataPath, 'SKSE', 'Plugins', 'Experience', 'Races', 'experiencePatch.csv');
            fh.saveTextFile(filePath, outputText.replace(/\n\,/g, "\n"));
        }
    })
});