import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class TransactionItemsTable1711193394685 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transaction_items',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'transaction_id',
            type: 'varchar',
          },
          {
            name: 'product_id',
            type: 'varchar',
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'unit_price',
            type: 'float',
          },
          {
            name: 'total_price',
            type: 'float',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'transaction_items',
      new TableForeignKey({
        columnNames: ['transaction_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'transactions',
        onDelete: 'CASCADE',
        name: 'fk_transaction_items_transactions',
      }),
    );

    await queryRunner.createForeignKey(
      'transaction_items',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'CASCADE',
        name: 'fk_transaction_items_products',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transaction_items');
    await queryRunner.dropForeignKey(
      'transaction_items',
      'fk_transaction_items_transactions',
    );
    await queryRunner.dropForeignKey(
      'transaction_items',
      'fk_transaction_items_products',
    );
  }
}
