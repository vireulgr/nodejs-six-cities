#!/usr/bin/env/node
import 'reflect-metadata'; // т.к. в классах используется @injectable и @inject

import { CLIApplication, GenerateCommand, HelpCommand, ImportCommand, VersionCommand } from './cli/index.js';

function bootstrap() {
  const cliApplication = new CLIApplication();

  cliApplication.registerCommands([
    new ImportCommand(),
    new HelpCommand(),
    new VersionCommand(),
    new GenerateCommand(),
  ]);

  cliApplication.processCommand(process.argv);
}


bootstrap();
