---
id: "{{ .File.ContentBaseName }}"
page_number: 0
status: "empty"
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
slug: "{{ .File.ContentBaseName }}"
---
