#!/usr/bin/env bash
zip TrackChanges-`git describe --abbrev=0 --tags`.zip _locales/*/* images/* lib/*/* manifest.json
