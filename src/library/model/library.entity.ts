import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entity representation of a library in the database.
 */
@Entity()
export class LibraryEntity {
  /**
   * Unique identifier for the library, generated as a UUID.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The name of the library.
   */
  @Column()
  name: string;

  /**
   * The path where the library resides. This value is unique across all libraries.
   */
  @Column({ unique: true })
  path: string;

  /**
   * The date and time when the library was created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * The date and time when the library was last updated.
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
