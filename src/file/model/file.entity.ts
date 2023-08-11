import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { LibraryEntity } from '../../library/model/entity';

/**
 * Entity representation of a file in the database.
 */
@Entity({ name: 'files' })
export class FileEntity {
  /**
   * Unique identifier for the library, generated as a UUID.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Name of the file.
   */
  @Column()
  name: string;

  /**
   * Path to the file's location.
   */
  @Column()
  path: string;

  /**
   * Type or extension of the file (e.g., 'jpg', 'txt').
   */
  @Column()
  type: string;

  /**
   * Size of the file in bytes.
   */
  @Column()
  size: number;

  /**
   * The date and time when the file was created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * The date and time when the file was last updated.
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Many-to-one relationship with LibraryEntity. Represents the library
   * to which this file belongs.
   */
  @ManyToOne(() => LibraryEntity, (library) => library.files)
  library: LibraryEntity;
}
