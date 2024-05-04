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
    `npx nx show projects --affected --type=app --base=${base} --head=HEAD`,
    {
      encoding: 'utf-8',
    }
  );

  return sanitizeAffectedOutput(affected);
}

function readAffectedLibs(base) {
  const affected = execSync(
    `npx nx show projects --affected --type=lib --base=${base} --head=HEAD`,
    {
      encoding: 'utf-8',
    }
  );

  return sanitizeAffectedOutput(affected);
}

function readAffectedProjects(base) {
  const affectedApps = readAffectedApps(base);
  const affectedLibs = readAffectedLibs(base);

  console.log('Affected apps:', affectedApps);
  console.log('Affected libs:', affectedLibs);

  return affectedApps.concat(affectedLibs);
}

function sanitizeAffectedOutput(affectedOutput) {
  return affectedOutput.replaceAll(/\s/g, ',').split(',');
}

function readAllProjects() {
  const projects = execSync(`npx nx show projects`, {
    encoding: 'utf-8',
  });

  return projects.split('\n');
}

function validateProjectParameter(projectNames) {
  if (!projectNames.length === 0) {
    console.error('No project(s) argument passed.');
    process.exit(1);
  }

  const allProjects = readAllProjects();
  projectNames.forEach((projectName) => {
    if(!allProjects.includes(projectName)) {
      console.error(
        `"${projectName}" is not the name of a project in this workspace.`
      );
      process.exit(1);
    }
  });
}

let projects = [];
let base;

try {
  projects = [
    ...JSON.parse(core.getInput('projects', { required: false }))
  ];
  const project = core.getInput('project', { required: false });
  if(project && project !== '') {
    projects.push(project);
  }

  base = core.getInput('base', { required: true });
} catch (err) {
  [, , projects, base] = process.argv;
}

validateProjectParameter(projects);

const affectedProjects = readAffectedProjects(base);
let isAffected = false;
projects.forEach((project) => {
  console.log(`Checking if ${project} is affected...`);
  if (affectedProjects.includes(project)) {
    console.log(`${project} is affected.`);
    isAffected = true;
  } else {
    console.log(`${project} is not affected.`);
  }
});

console.log('RESULT IS AFFECTED:', isAffected);
core.setOutput('is-affected', isAffected);
