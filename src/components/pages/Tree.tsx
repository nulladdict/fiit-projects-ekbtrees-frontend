import React, { Component } from 'react';
import styles from './Tree.module.css'
import modalStyles from "../Modal/Modal.module.css";
import { NavLink } from "react-router-dom";
import Spinner from "../Spinner";
import { getUrlParamValueByKey } from "../../helpers/url";
import {getTree, getFilesByTree, deleteTree, deleteFiles} from "../EditTreeForm/actions";
import { formatDate} from '../../helpers/date';
import FileUpload from "../FileUpload";
import { ITreeModelConverted, IJsonTree, IFile } from "../../common/types";
import { ITreeProps, ITreeState } from "./types";
import Modal from "../Modal/Modal";
import {isNumber} from "../../common/treeForm";


export class Tree extends Component<ITreeProps, ITreeState> {
	static defaultProps = {
		user: null
	}

	private treeId: string | number | null = null;
	private fileIds: number[] = [];
	private canDelete: boolean = false;
	private canEdit: boolean = false;
	private operationInProgress: boolean = false;

	constructor(props: ITreeProps) {
		super(props);

		this.state = {
			tree: null,
			loading: true,
			files: [],
			images: [],
			loadingFiles: true,
			modalShow: false,
			successfullyDeleted: false,
		}
	}

	convertTree (tree: IJsonTree): ITreeModelConverted {
		const {
			age,
			created,
			conditionAssessment,
			diameterOfCrown,
			heightOfTheFirstBranch,
			numberOfTreeTrunks,
			treeHeight,
			species,
			status,
			treePlantingType,
			trunkGirth,
			updated,
			geographicalPoint,
			id
		} = tree;

		return {
			latitude: {
				title: 'Широта',
				value: geographicalPoint?.latitude ?? null
			},
			longitude: {
				title: 'Долгота',
				value: geographicalPoint?.longitude ?? null
			},
			age: {
				title: 'Возраст (в годах)',
				value: age as number
			},
			created: {
				title: 'Дата и время добавления записи',
				value: created ? formatDate(created) : null
			},
			conditionAssessment: {
				title: 'Визуальная оценка состония',
				value: conditionAssessment
			},
			diameterOfCrown: {
				title: 'Диаметр кроны (в метрах)',
				value: diameterOfCrown ?? null
			},
			heightOfTheFirstBranch: {
				title: 'Высота первой ветви от земли (в метрах)',
				value: heightOfTheFirstBranch ?? null
			},
			numberOfTreeTrunks: {
				title: 'Число стволов',
				value: numberOfTreeTrunks ?? null
			},
			treeHeight: {
				title: 'Высота (в метрах)',
				value: treeHeight ?? null
			},
			species: {
				title: 'Порода',
				value: species?.title ?? null
			},
			status: {
				title: 'Статус дерева',
				value: status ?? null
			},
			treePlantingType: {
				title: 'Тип посадки дерева',
				value: treePlantingType ?? null
			},
			trunkGirth: {
				title: 'Обхват самого толстого ствола (в сантиметрах)',
				value: trunkGirth ?? null
			},
			updated: {
				title: 'Дата и время последнего редактирования',
				value: updated ? formatDate(updated) : null
			},
			id: id ?? 0 // FIXME: is it possible to not know tree id
		}
	}

	componentDidMount() {
		this.treeId = getUrlParamValueByKey('tree');

		if (this.treeId) {
			getTree(this.treeId)
				.then((tree: IJsonTree) => {
					this.fileIds = tree.fileIds ?? [];
					this.canDelete = this.checkCanDelete(tree);
					this.canEdit = this.checkCanEdit(tree);
					this.setState({
						tree: this.convertTree(tree),
						loading: false
					}, () => {
						getFilesByTree(tree.fileIds ?? [])
							.then(files => {
								const images = files.filter((file: IFile) => file.mimeType.startsWith('image'));
								const filesWithoutImages = files.filter((file: IFile) => !file.mimeType.startsWith('image'));

								this.setState({
									files: filesWithoutImages,
									images,
									loadingFiles: false
								})
							})
							.catch(error => {
								console.error(error, 'Ошибка при загрузке файлов!');
								this.setState({
									loadingFiles: false
								})
							})
					})
				})
				.catch((error: Error) => {
					console.error(error, 'Ошибка!')
					if (this.props.user === null || error.message?.split(' ')[0] === '401') {
						this.props.history.push('/login');
					}
					this.setState({
						loading: false
					})
				})
		}
	}

	checkCanDelete(tree: IJsonTree) {
		return tree.deletable ?? false;
	}

	checkCanEdit(tree: IJsonTree) {
		return tree.editable ?? false;
	}

	confirmDeleteCurrentTree = () => {
		this.setState({modalShow: true});
	}

	closeModal = () => this.setState({modalShow: false});

	trySetMaoViewPosition = () => {
		if (this.state.tree) {
			const lat = this.state.tree.latitude.value;
			const lon = this.state.tree.longitude.value;

			if (lat && lon) {
				const latNum = isNumber(lat) ? lat : parseFloat(lat.toString());
				const lonNum = isNumber(lon) ? lon : parseFloat(lon.toString());
				this.props.setMapViewPosition([latNum, lonNum]);
			}
		}
	}

	deleteCurrentTree = () => {
		if (this.treeId && this.canDelete && !this.operationInProgress) {
			this.operationInProgress = true;
			deleteFiles(this.fileIds).then(deletedAllFiles => {
				if (!deletedAllFiles.every(v => v) || !this.treeId) {
					alert("error while deleting all files");
					return;
				}
				deleteTree(this.treeId).then(succ => {
					if (succ) {
						// alert("tree is deleted");
						this.trySetMaoViewPosition();
						this.setState({modalShow: false});
						// this.props.history.goBack();
						this.props.history.push("/map");
					} else {
						alert("error while deleting the tree");
						// this.setState({modalShow: true, modalMessage: "Ошибка при удалении дерева"});
					}
				}).catch(err => {
					alert("error while deleting the tree");
				});
			});
		}
	}

	renderModalContent() {
		return (
			<React.Fragment>
				<p>Вы уверены, что хотите удалить это дерево?</p>
				<div className={modalStyles.buttonContainer}>
					<button className={modalStyles.danger} onClick={this.deleteCurrentTree}>Да, удалить</button>
					<button className={modalStyles.success} onClick={this.closeModal}>Нет</button>
				</div>
			</React.Fragment>
		)
	}

	renderEditLink () {
		const {tree} = this.state;
		return (
			<div className={styles.editLinkWrapper}>
				{ this.canDelete && <span className={styles.removeLink} onClick={this.confirmDeleteCurrentTree}>Удалить</span> }
				{ this.canEdit && <NavLink to={`/trees/tree=${tree?.id}/edit`} className={styles.editLink}>Редактировать</NavLink> }
			</div>
		)
	}

	renderRows () {
		const {tree} = this.state;
		const result: JSX.Element[]  = [];
		if (tree == null) {
			return result;
		}
		Object.keys(tree).forEach((key, index) => {
			const treeKey = key as keyof ITreeModelConverted;
			if (treeKey === 'id') {
				return;
			}
			if (tree[treeKey].value) {
				result.push(
					<div key={index} className={styles.row}>
						<div className={styles.col}>
							{tree[treeKey].title}
						</div>
						<div className={styles.col}>
							{tree[treeKey].value}
						</div>
					</div>
				)
			}
		});

		return result;
	}

	renderTable () {
		return (
			<div className={styles.table}>
				<div className={styles.tbody}>
					{this.renderRows()}
				</div>
			</div>
		)
	}

	renderDetails () {
		const {user} = this.props;

		return (
			<div className={styles.wrapper}>
				{user ? this.renderEditLink() : null}
				{this.renderTable()}
			</div>
		)
	}

	renderFiles () {
		const {files, loadingFiles} = this.state;

		if (loadingFiles) {
			return <Spinner />;
		}

		if (files.length) {
			return (
				<>
					<h3 className={styles.title}> Файлы </h3>
					<FileUpload mode="read" files={files} />
				</>
			)
		}

		return null;
	}

	renderImages () {
		const {images, loadingFiles} = this.state;

		if (loadingFiles) {
			return <Spinner />;
		}

		if (images.length) {
			return (
				<>
					<h3 className={styles.title}>Картинки</h3>
					<FileUpload
						mode="read"
						type="image"
						files={images}
					/>
				</>
			)
		}

		return null;
	}

	renderContent () {
		const {loading} = this.state;

		if (loading) {
			return <Spinner />;
		}

		return (
			<React.Fragment>
				<Modal show={this.state.modalShow} onClose={this.closeModal}>
					{this.renderModalContent()}
				</Modal>
				<div className={styles.container}>
					<h3 className={styles.title}> Карточка дерева </h3>
					{this.renderDetails()}
					{this.renderImages()}
					{this.renderFiles()}
				</div>
			</React.Fragment>
		)
	}

	render () {
		return this.renderContent();
	}
}

export default Tree;
