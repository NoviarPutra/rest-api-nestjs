import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TransactionTable1711090368458 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
