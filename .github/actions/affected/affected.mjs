/**
 * @license
 * MIT License
 *
 * Copyright (c) 2021 ngworkers
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * Terms
 */
import { execSync } from 'child_process';
import * as core from '@actions/core';

function readAffectedApps(base) {
  const affected = execSync(
    `npx nx print-affected --type=app --select=projects --base=${base} --head=HEAD`,
    {
      encoding: 'utf-8',
    }
  );

  return sanitizeAffectedOutput(affected);
}

function readAffectedLibs(base) {
  const affected = execSync(
    `npx nx print-affected --type=lib --select=projects --base=${base} --head=HEAD`,
    {
      encoding: 'utf-8',
    }
  );

  return sanitizeAffectedOutput(affected);
}

function readAffectedProjects(base) {
  const affectedApps = readAffectedApps(base);
  const affectedLibs = readAffectedLibs(base);

  return affectedApps.concat(affectedLibs);
}

function sanitizeAffectedOutput(affectedOutput) {
  return affectedOutput.replaceAll(/\s/g, '').split(',');
}

function readAllProjects() {
  const projects = execSync(`npx nx show projects`, {
    encoding: 'utf-8',
  });

  return projects.split('\n');
}

function validateProjectParameter(projectName) {
  if (!projectName) {
    console.error('No project argument passed.');

    process.exit(1);
  }

  const allProjects = readAllProjects();
  const isProjectFound = allProjects.includes(projectName);

  if (!isProjectFound) {
    console.error(
      `"${projectName}" is not the name of a project in this workspace.`
    );

    process.exit(1);
  }
}

let project;
let base;

try {
  project = core.getInput('project', { required: true });
  base = core.getInput('base', { required: true });
} catch (err) {
  [, , project, base] = process.argv;
}

validateProjectParameter(project);

const affectedProjects = readAffectedProjects(base);
const isAffected = affectedProjects.includes(project);

core.setOutput('is-affected', isAffected);
