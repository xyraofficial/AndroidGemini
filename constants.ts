
import { SetupStep, PackageSource, ActionTemplate } from './types';

export const SETUP_STEPS: SetupStep[] = [
  {
    id: '1',
    title: 'Update Package List',
    command: 'pkg update && pkg upgrade -y',
    description: 'Refresh the local package database and upgrade existing packages to their latest versions.'
  },
  {
    id: '2',
    title: 'Install Core Tools',
    command: 'pkg install git wget curl zip unzip -y',
    description: 'Essential utilities for downloading, extracting, and version controlling your projects.'
  },
  {
    id: '3',
    title: 'Install Java (OpenJDK)',
    command: 'pkg install openjdk-17 -y',
    description: 'Installs OpenJDK 17, the recommended LTS version for modern Java and Android development.'
  },
  {
    id: '4',
    title: 'Install Gradle',
    command: 'pkg install gradle -y',
    description: 'The standard build automation tool for Java projects.'
  },
  {
    id: '5',
    title: 'Verify Installation',
    command: 'java -version && gradle -v',
    description: 'Check that both Java and Gradle are correctly installed and accessible via command line.'
  }
];

export const PACKAGE_SOURCES: PackageSource[] = [
  {
    name: 'Main Repository',
    url: 'https://packages.termux.dev/apt/termux-main',
    description: 'Official repository for standard Termux packages.',
    type: 'official'
  },
  {
    name: 'X11 Repository',
    url: 'https://packages.termux.dev/apt/termux-x11',
    description: 'Packages related to the X Window System.',
    type: 'official'
  },
  {
    name: 'Root Repository',
    url: 'https://packages.termux.dev/apt/termux-root',
    description: 'Packages that require root access (optional).',
    type: 'official'
  }
];

export const ACTION_TEMPLATES: ActionTemplate[] = [
  {
    name: 'Java Gradle Build',
    description: 'Basic workflow to compile and test a Java/Gradle project.',
    content: `name: Java CI with Gradle

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
    - name: Setup Gradle
      uses: gradle/gradle-build-action@v2
    - name: Build with Gradle
      run: ./gradlew build
`
  },
  {
    name: 'Release APK/JAR',
    description: 'Workflow that builds a production release and uploads the artifact.',
    content: `name: Release Build

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
    - name: Build Artifact
      run: ./gradlew assembleRelease
    - name: Create Release
      uses: softprops/action-gh-release@v1
      if: startsWith(github.ref, 'refs/tags/')
      with:
        files: |
          build/libs/*.jar
          app/build/outputs/apk/release/*.apk
`
  }
];
