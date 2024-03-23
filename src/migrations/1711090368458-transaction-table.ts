import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class TransactionTable1711090368458 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'user_id',
            type: 'varchar',
          },
          {
            name: 'timestamp',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'amount',
            type: 'float',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
    await queryRunner.dropForeignKey('transactions', 'user_id');
  }
}
