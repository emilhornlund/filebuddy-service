import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FileEntity } from '../../../file';

/**
 * Entity representation of a library in the database.
 */
@Entity({ name: 'libraries' })
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

  /**
   * One-to-many relationship with FileEntity. Represents all the files
   * associated with this library. When a LibraryEntity is deleted,
   * all its related FileEntity records will also be deleted.
   */
  @OneToMany(() => FileEntity, (file) => file.library)
  files: FileEntity[];
}
