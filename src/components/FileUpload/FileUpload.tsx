import React, {Component} from "react";
import {DropzoneDialog} from 'material-ui-dropzone'
import styles from './FileUpload.module.css';
import classNames from "classnames";
import LinearProgress from "../LinearProgress/LinearProgress";
import ModalImg from '../ModalImg';
import { IFile } from "../../common/types";
import { IFileUploadProps, IFileUploadState } from "./types";


export class FileUpload extends Component<IFileUploadProps, IFileUploadState> {
	constructor(props: IFileUploadProps) {
		super(props);

		this.state = {
			open: false,
			modalOpen: false
		};
	}

	handleClose() {
		this.setState({
			open: false
		});
	}

	handleDelete: (id: number | string) => React.MouseEventHandler<HTMLElement> = (id: number | string) => () => {
		const {onDelete} = this.props;
		onDelete && onDelete(id)
	}

	handleUpload (files: File[]) {
		const {onUpload} = this.props;
		onUpload && onUpload(files);
	}

	handleSave(files: File[]) {
		this.setState({
			open: false,
		}, () => this.handleUpload(files));
	}

	handleOpen() {
		this.setState({
			open: true,
		});
	}

	renderViewLinks () {
		const {files} = this.props;

		return files.map((file: IFile) => {
			return (
				<a key={file.id}  className={styles.editLink} href={file.uri}>
					{file.title}
				</a>
			)
		});
	}

	renderImageLinks () {
		const {files} = this.props;

		return files.map((file: IFile) => {
			return (							
				<img key={file.id} className={styles.image} src={file.uri} alt={file.title} onClick={this.ShowModal}/>
			)			
		});		
	}
	ShowModal: React.MouseEventHandler<HTMLImageElement> = (e) => {
		this.setState({
			modalOpen: true,
			modalData: e.currentTarget.src
		}
		)
	}
    CloseModal = () => {
        this.setState({
            modalOpen: false,
			modalData: null
        })
    }	
	renderEditLinks () {
		const {files} = this.props;

		return files.map((file: IFile) => {
			return (
				<div key={file.id} className={styles.item}>
					<div className={styles.file}>
						<button onClick={this.handleDelete(file.id)} className={styles.deleteFile}>
							<i className={classNames(["fa", "fa-times"])} />
						</button>
						<span>{file.title}</span>
					</div>
				</div>
			)
		});
	}

	renderEditImageLinks () {
		const {files} = this.props;
		return files.map((file: IFile) => {
			return (
				<div key={file.id} className={styles.itemImage}>
					<div className={styles.file}>
						<button onClick={this.handleDelete(file.id)} className={styles.deleteFile}>
							<i className={classNames(["fa", "fa-times"])} />
						</button>
						<img className={styles.image} src={file.uri} alt={file.title} />
					</div>
				</div>
			)
		});
	}

	renderProgress () {
		const {uploading} = this.props;

		if (uploading) {
			return <LinearProgress />;
		}

		return null;
	}

	getFileAddedMessage = (fileName: string) => `Файл ${fileName} успешно добавлен для загрузки`;

	getFileRemovedMessage = (fileName: string) => `Файл ${fileName} удален`;

	getFileLimitExceedMessage = (fileLimit: number) => `Превышено количество загружаемых файлов. Максимальное количество ${fileLimit}`;

	renderUploaderImage () {
		return (
			<>
				{this.renderEditImageLinks()}
				{this.renderProgress()}
				<DropzoneDialog
					acceptedFiles={['image/*']}
					open={this.state.open}
					onSave={this.handleSave.bind(this)}
					showPreviews={true}
					maxFileSize={5000000}
					filesLimit={10}
					dropzoneText="Перенесите сюда загружаемые картинки или кликникте в облась загрузки"
					dialogTitle="Загрузить картинки"
					cancelButtonText="Отмена"
					submitButtonText="Загрузить"
					getFileAddedMessage={this.getFileAddedMessage}
					getFileRemovedMessage={this.getFileRemovedMessage}
					getFileLimitExceedMessage={this.getFileLimitExceedMessage}
					previewText="Предварительный просмотр"
					onClose={this.handleClose.bind(this)}
				/>
				<div className={styles.addingFilesWrapper}>
					<button className={styles.addBtn} onClick={this.handleOpen.bind(this)}>
						Добавить картинки
					</button>
				</div>
			</>
		)
	}

	renderUploader () {
		return (
			<>
				{this.renderEditLinks()}
				{this.renderProgress()}
				<DropzoneDialog
					open={this.state.open}
					onSave={this.handleSave.bind(this)}
					showPreviews={true}
					maxFileSize={5000000}
					filesLimit={10}
					dropzoneText="Перенесите сюда загружаемые файлы или кликникте в облась загрузки"
					dialogTitle="Загрузить файлы"
					cancelButtonText="Отмена"
					submitButtonText="Загрузить"
					getFileAddedMessage={this.getFileAddedMessage}
					getFileRemovedMessage={this.getFileRemovedMessage}
					getFileLimitExceedMessage={this.getFileLimitExceedMessage}
					previewText="Предварительный просмотр"
					onClose={this.handleClose.bind(this)}
				/>
				<div className={styles.addingFilesWrapper}>
					<button className={styles.addBtn} onClick={this.handleOpen.bind(this)}>
						Добавить файлы
					</button>
				</div>
			</>
		)
	}

	renderContent () {
		const {mode, type} = this.props;

		if (mode === 'read') {
			if (type === 'image') {
				return (
					<div className={styles.linksWrapperImage}>
						{this.renderImageLinks()}
					</div>
				);
			}

			return (
				<div className={styles.linksWrapper}>
					{this.renderViewLinks()}
				</div>
			);
		}

		if (type === 'image') {
			return (
				<div className={styles.wrapper}>
					{this.renderUploaderImage()}
				</div>
			)
		}

		return (
			<div className={styles.wrapper}>
				{this.renderUploader()}
			</div>
		);
	}


	render() {
		return (
			<>
				{this.renderContent()}
				<ModalImg modalOpen={this.state.modalOpen} handleClose={this.CloseModal} modalData={this.state.modalData ?? undefined}/>
			</>
		)
	}
}

export default FileUpload;
