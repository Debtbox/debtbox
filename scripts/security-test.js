#!/usr/bin/env node

/**
 * Security Testing Script
 * Runs comprehensive security tests for the frontend application
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { relative, join, extname } from 'path';

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m',
};

// Security test configuration
const securityTests = {
  // Check for sensitive data in code
  sensitiveData: {
    name: 'Sensitive Data Detection',
    patterns: [
      /password\s*=\s*['"][^'"]+['"]/gi,
      /api[_-]?key\s*=\s*['"][^'"]+['"]/gi,
      /secret\s*=\s*['"][^'"]+['"]/gi,
      /token\s*=\s*['"][^'"]+['"]/gi,
      /private[_-]?key\s*=\s*['"][^'"]+['"]/gi,
    ],
    severity: 'high',
  },

  // Check for console.log statements in production code
  consoleLogs: {
    name: 'Console Log Detection',
    patterns: [
      // Only flag console statements that are not wrapped in development checks
      /console\.(log|warn|error|info|debug)(?!\s*\([^)]*import\.meta\.env\.DEV)/g,
    ],
    severity: 'medium',
  },

  // Check for hardcoded URLs
  hardcodedUrls: {
    name: 'Hardcoded URL Detection',
    patterns: [
      // Exclude SVG namespaces and common legitimate URLs
      /https?:\/\/(?!www\.w3\.org|schemas\.microsoft\.com|xmlns\.com)[^\s'"]+/g,
    ],
    severity: 'medium',
  },

  // Check for eval usage
  evalUsage: {
    name: 'Eval Usage Detection',
    patterns: [/\beval\s*\(/g, /new\s+Function\s*\(/g],
    severity: 'high',
  },

  // Check for innerHTML usage
  innerHTML: {
    name: 'innerHTML Usage Detection',
    patterns: [/\.innerHTML\s*=/g, /\.outerHTML\s*=/g],
    severity: 'medium',
  },
};

// File extensions to check
const fileExtensions = ['.ts', '.tsx', '.js', '.jsx'];

// Directories to exclude
const excludeDirs = ['node_modules', 'dist', 'build', '.git', 'coverage'];

// Run security tests
async function runSecurityTests() {
  console.log(
    `${colors.bold}${colors.blue}🔒 Running Security Tests...${colors.reset}\n`,
  );

  const results = {
    totalFiles: 0,
    totalIssues: 0,
    tests: {},
  };

  // Initialize test results
  Object.keys(securityTests).forEach((testKey) => {
    results.tests[testKey] = {
      name: securityTests[testKey].name,
      severity: securityTests[testKey].severity,
      issues: [],
      passed: true,
    };
  });

  // Get all files to check
  const files = getAllFiles('./src', fileExtensions, excludeDirs);
  results.totalFiles = files.length;

  console.log(`📁 Scanning ${files.length} files...\n`);

  // Check each file
  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf8');
      const relativePath = relative(process.cwd(), file);

      // Run each security test
      Object.keys(securityTests).forEach((testKey) => {
        const test = securityTests[testKey];
        const issues = findIssues(content, test.patterns, relativePath);

        if (issues.length > 0) {
          results.tests[testKey].issues.push(...issues);
          results.tests[testKey].passed = false;
          results.totalIssues += issues.length;
        }
      });
    } catch (error) {
      console.error(
        `${colors.red}Error reading file ${file}: ${error.message}${colors.reset}`,
      );
    }
  }

  // Display results
  displayResults(results);

  // Return exit code
  return results.totalIssues > 0 ? 1 : 0;
}

// Get all files recursively
function getAllFiles(dir, extensions, excludeDirs) {
  const files = [];

  if (!existsSync(dir)) {
    return files;
  }

  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!excludeDirs.includes(item)) {
        files.push(...getAllFiles(fullPath, extensions, excludeDirs));
      }
    } else if (stat.isFile()) {
      const ext = extname(item);
      if (extensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

// Find issues in file content
function findIssues(content, patterns, filePath) {
  const issues = [];

  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const lineNumber = content.substring(0, match.index).split('\n').length;
      issues.push({
        file: filePath,
        line: lineNumber,
        match: match[0],
        context: getContext(content, match.index),
      });
    }
  });

  return issues;
}

// Get context around match
function getContext(content, index, contextLines = 2) {
  const lines = content.split('\n');
  const lineNumber = content.substring(0, index).split('\n').length;
  const start = Math.max(0, lineNumber - contextLines - 1);
  const end = Math.min(lines.length, lineNumber + contextLines);

  return lines.slice(start, end).map((line, i) => ({
    number: start + i + 1,
    content: line,
    isMatch: start + i + 1 === lineNumber,
  }));
}

// Display test results
function displayResults(results) {
  console.log(
    `${colors.bold}${colors.cyan}📊 Security Test Results${colors.reset}\n`,
  );
  console.log(`Total Files Scanned: ${results.totalFiles}`);
  console.log(`Total Issues Found: ${results.totalIssues}\n`);

  // Display results for each test
  Object.keys(results.tests).forEach((testKey) => {
    const test = results.tests[testKey];
    const status = test.passed ? '✅ PASS' : '❌ FAIL';
    const color = test.passed ? colors.green : colors.red;

    console.log(
      `${color}${status}${colors.reset} ${test.name} (${test.severity})`,
    );

    if (!test.passed) {
      test.issues.forEach((issue) => {
        console.log(
          `  ${colors.yellow}📁 ${issue.file}:${issue.line}${colors.reset}`,
        );
        console.log(`    ${colors.red}Found: ${issue.match}${colors.reset}`);

        // Show context
        issue.context.forEach((line) => {
          const prefix = line.isMatch ? '  >>> ' : '      ';
          const lineColor = line.isMatch ? colors.red : colors.white;
          console.log(
            `${prefix}${lineColor}${line.number}: ${line.content}${colors.reset}`,
          );
        });
        console.log('');
      });
    }
  });

  // Summary
  console.log(`${colors.bold}${colors.cyan}📋 Summary${colors.reset}`);

  const criticalIssues = Object.values(results.tests).filter(
    (t) => !t.passed && t.severity === 'high',
  ).length;
  const mediumIssues = Object.values(results.tests).filter(
    (t) => !t.passed && t.severity === 'medium',
  ).length;

  if (criticalIssues > 0) {
    console.log(
      `${colors.red}🚨 ${criticalIssues} critical security issues found!${colors.reset}`,
    );
  }

  if (mediumIssues > 0) {
    console.log(
      `${colors.yellow}⚠️  ${mediumIssues} medium severity issues found.${colors.reset}`,
    );
  }

  if (results.totalIssues === 0) {
    console.log(`${colors.green}🎉 No security issues found!${colors.reset}`);
  }

  console.log('');
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  runSecurityTests()
    .then((exitCode) => {
      process.exit(exitCode);
    })
    .catch((error) => {
      console.error(
        `${colors.red}Security test failed: ${error.message}${colors.reset}`,
      );
      process.exit(1);
    });
}

export { runSecurityTests, securityTests };
