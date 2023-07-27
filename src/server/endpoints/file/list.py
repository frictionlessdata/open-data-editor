from __future__ import annotations

import os
from pathlib import Path
from typing import Dict, List, Optional

from fastapi import Request
from frictionless import FrictionlessException
from pydantic import BaseModel

from ... import helpers, models
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    folder: Optional[str] = None


class Result(BaseModel, extra="forbid"):
    files: List[models.File]


@router.post("/file/list", response_model_exclude_unset=True)
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


# TODO: support .gitignore
def action(project: Project, props: Optional[Props] = None) -> Result:
    fs = project.filesystem
    db = project.database
    md = project.metadata

    # Index by name
    errors_by_name: Dict[str, int] = {}
    for name, descriptor in db.iter_artifacts(type="measure"):
        errors_by_name[name] = descriptor["errors"]

    # Index by path
    name_by_path: Dict[str, str] = {}
    type_by_path: Dict[str, str] = {}
    errors_by_path: Dict[str, int] = {}
    for descriptor in md.iter_documents(type="record"):
        path = descriptor["path"]
        name_by_path[path] = descriptor["name"]
        type_by_path[path] = descriptor["type"]
        errors_by_path[path] = errors_by_name.get(descriptor["name"], 0)

    # Get folder
    folder = fs.basepath
    if props and props.folder:
        folder = fs.get_fullpath(props.folder)
        if not folder.is_dir():
            raise FrictionlessException("folder not found")

    # List files
    items: List[models.File] = []
    is_gitignore = helpers.is_gitignore(project)
    for root, folders, files in os.walk(folder):
        root = Path(root)
        for file in files:
            if file.startswith("."):
                continue
            if is_gitignore(file):
                continue
            path = fs.get_path(root / file)
            item = models.File(path=path, type=type_by_path.get(path, "file"))
            if path in name_by_path:
                item.name = name_by_path[path]
            if path in errors_by_path:
                item.errors = errors_by_path[path]
            items.append(item)
        for folder in list(folders):
            if folder.startswith(".") or folder in IGNORED_FOLDERS:
                folders.remove(folder)
                continue
            if is_gitignore(folder):
                continue
            path = fs.get_path(root / folder)
            item = models.File(path=path, type="folder")
            items.append(item)

    items = list(sorted(items, key=lambda item: item.path))
    return Result(files=items)


IGNORED_FOLDERS = [
    "node_modules",
    "logs" "*.logs",
    ".pyc",
    ".idea/",
    ".vscode/",
    "*.sublime*",
    ".DS_STORE",
    "npm-debug.log*",
    "package-lock.json",
    "/.cache",
    "*.sqlite",
    # Byte-compiled
    ".pytest_cache/",
    ".ruff_cache/",
    "__pycache__/",
    # Unit test / coverage
    ".coverage",
    ".coverage.*",
    "coverage.xml",
    "*.py[cod]",
    ".pytest_cache/",
    ".tox/",
    ".nox/",
    "cover/",
    "*.whl",
    # C
    "*.so"
    # Distribution
    "bin/",
    "build/",
    "develop-eggs/",
    "dist/",
    "downloads/",
    "eggs/",
    ".eggs/",
    "lib/",
    "lib64/",
    "parts",
    "sdist/",
    "var/",
    "wheels/",
    "share/python-wheels/",
    "*.egg-info/",
    ".installed.cfg",
    "*.egg",
    "MANIFEST"
    # Jupyter
    ".ipynb_checkpoints",
    # mypy
    ".mypy_cache/",
    ".dmypy.json",
    "dmypy.json",
]
